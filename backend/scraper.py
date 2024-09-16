import os
import json
import time
import requests
from openai import OpenAI
from dotenv import load_dotenv
from linkedin_api import Linkedin
import pymupdf
import numpy as np

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

async def get_git_score(username: str) -> float:
    # URL to scrape
    url = f"https://github-readme-stats.vercel.app/api?username={username}&rank_icon=percentile"

    # Wait for 1 second
    time.sleep(1)

    # Send a GET request to the URL
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Get the content
        content = response.text
        print("Content retrieved successfully:")
        # print(content)

        # get text between '"rank-percentile-text">' and '</text>'
        start = content.find('"rank-percentile-text">') + len('"rank-percentile-text">')
        end = content.find("</text>", start)
        score = 100 - float(content[start : end - 1].strip()[:-1])

        # only keep 2 decimal places
        score = round(score, 2)

    else:
        print("Failed to retrieve content")
        score = 0

    return score


async def get_linkedin_score(username: str, job_description: str) -> list:
    # Authenticate using any Linkedin user account credentials
    api = Linkedin("dummyak3@gmail.com", "dummy@2024")

    profile = api.get_profile(public_id=username)
    # Prompt chatgpt to go through the whole profile and make a list of top 3 to 5 relevant domains where the person has applied their skills, built projects, or has experience in. Examples include bioinformatics, cloud computing, industrial automation, website development, fitness, etc.
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "Generate a list of top 3 to 5 relevant domains where the person has applied their skills, built projects, or has experience in. Examples include bioinformatics, cloud computing, industrial automation, website development, fitness, etc. Only return the names of domains separated by a comma, do not return any other text.` The following is their linkedin profile",
            },
            {"role": "user", "content": str(profile)},
        ],
    )
    domains = response.choices[0].message.content

    profile = api.get_profile_posts(public_id=username)

    # save profile dict as a json file
    with open("profile.json", "w") as f:
        json.dump(profile, f)

    all_posts = ""
    for post in profile:
        all_posts += post["commentary"]["text"]["text"]
        all_posts += "\n\n\n --- Next Post --- \n\n\n"

    print(all_posts)

    # Prompt chatgpt to go through the posts and answer What does this person post regularly? what type of content do they share?
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "What does this person post regularly about? What domain is this person interested in, and experienced in? What type of content do they share? Generate a concise answer in 2 lines to these questions. The following is all the posts from their Linkedin profile.",
            },
            {"role": "user", "content": all_posts},
        ],
    )
    tone = response.choices[0].message.content

    # Prompt chatgpt to go through the posts and answer what content of it is relevant to the job {put descri}?
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a recruiter at a Corporation. You hiring one candidate for the position of a software engineer with the job description {job_description}. What content of the following linkedin posts is relevant to the job description? Generate a concise answer in 2 lines to this question.`",
            },
            {"role": "user", "content": all_posts},
        ],
    )
    relevance = response.choices[0].message.content

    # Prompt chatgpt to go through the posts and list out Accoplishments, awards, and projects
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a recruiter at a Corporation. You hiring one candidate for the position of a software engineer with the job description {job_description}. Generate a comma-separated list of accomplishments, awards, and projects from the following posts that may or may not be relevant to the job description but show the efforts put in.",
            },
            {"role": "user", "content": all_posts},
        ],
    )
    accomplishments = response.choices[0].message.content

    return [tone, relevance, accomplishments, domains]


async def get_embedding(text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding


async def get_text_from_pdf(pdf_path):
    pdf = pymupdf.open(pdf_path)
    text = ""
    for page in pdf:
        text += page.get_text()
    return text


async def get_pdf_from_link(link: str):
    response = requests.get(link)
    with open("resume.pdf", "wb") as f:
        f.write(response.content)
    return "./resume.pdf"


async def scrape_resumes(job_description: str):
    jd = await get_embedding(job_description)
    job_description_embedding = np.array(
        jd
    )  # Convert to numpy array
    # open resumes.json as a dict. fetch from "url" key and use OpenAI API to find the name and email. store in dict
    # then use OpenAI API to create vector embeddings of all the resumes and add to the dictionary as "vector" key
    # then vectorize the job description
    # then find distance using cosine similarity between the job description and all the resumes, and store as "distance" key for each resume

    # open resumes.json as a dict
    with open("resumes.json", "r") as f:
        resumes = json.load(f)

    # fetch from "url" key and use OpenAI API to find the name and email. store in dict
    for resume in resumes:
        resume_path = await get_pdf_from_link(resume["url"])
        resume_text = await get_text_from_pdf(resume_path)
        re = await get_embedding(resume_text)
        # print(resume_text)
        resume_embedding = np.array(
            re
        )  # Convert to numpy array
        resume["vector"] = list(resume_embedding)
        resume["text"] = resume_text

        # calculate the distance between the resume and the job description
        distance = np.linalg.norm(resume_embedding - job_description_embedding)
        resume["distance"] = distance

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "Extract the name from the resume text. Return only the name without any other character.",
                },
                {"role": "user", "content": resume_text},
            ],
        )
        resume["name"] = response.choices[0].message.content

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "Extract the email from the resume text. Return only the email without any other character.",
                },
                {"role": "user", "content": resume_text},
            ],
        )
        resume["email"] = response.choices[0].message.content

    final_data = {"job_description": job_description, "applicants": resumes}

    # store dictionary in a json file
    with open("test_resumes.json", "w") as f:
        json.dump(final_data, f)

@app.get("/predict")
async def predict_chances(resume_link: str, job_description: str):
    # get the text from the resume
    resume_path = await get_pdf_from_link(resume_link)
    resume_text = await get_text_from_pdf(resume_path)
    # print(resume_text)
    resume_embedding = np.array(await get_embedding(resume_text))  # Convert to numpy array
    jd = await get_embedding(job_description)
    job_description_embedding = np.array(
        jd
    )  # Convert to numpy array

    # calculate the distance between the resume and the job description
    distance = np.linalg.norm(resume_embedding - job_description_embedding)

    # load data from test_resumes.json
    with open("data_resumes.json", "r") as f:
        resumes = json.load(f)

    resumes = resumes["applicants"]

    # count number of resumes with distance less than the current resume. keep track of top 5 resumes with their text which are not in ascending order
    count = 0
    top_resumes = []
    for resume in resumes:
        if resume["distance"] < distance:
            count += 1
        if len(top_resumes) < 5:
            top_resumes.append(resume)
        else:
            top_resumes = sorted(top_resumes, key=lambda x: x["distance"], reverse=True)
            if resume["distance"] < top_resumes[-1]["distance"]:
                top_resumes[-1] = resume

    print("Number of resumes with distance less than the current resume:", count)
    # calculate percent of people with distance less than the current resume
    percent = count / len(resumes) * 100
    print("Percent of people with distance less than the current resume:", percent)

    # get the text of the top 5 resumes
    top_5_resumes_text = [resume["text"] for resume in top_resumes]

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a recruiter at a company. You completed hiring candidates for the position of a software engineer with the job description {job_description}. Based on the job description, what can the person in {resume_text} improve? Tell what does the resume lack in compared to other 4, without revealing any information about others? The feedback must not contain the name of any person. write in second person, as you are giving feedback. The top 5 resumes selected for this job are:",
            },
            {"role": "user", "content": "\n --- \n".join(top_5_resumes_text)},
        ],
    )

    feedback = response.choices[0].message.content

    return [percent, feedback]

@app.post("/add")
async def add_person(
    name: str,
    email: str,
    github_username: str,
    linkedin_username: str,
    resume_link: str,
    job_description: str,
    gpa: float,
):
    print("Adding person")
    print("name =", name)
    print("email =", email)
    print("github_username =", github_username)
    print("linkedin_username =", linkedin_username)
    print("resume_link =", resume_link)
    print("job_description =", job_description)

    resume_path = await get_pdf_from_link(resume_link)
    resume_text = await get_text_from_pdf(resume_path)
    # print(resume_text)
    resume_embedding = np.array(await get_embedding(resume_text))  # Convert to numpy array
    jd = await get_embedding(job_description)
    job_description_embedding = np.array(
        jd
    )  # Convert to numpy array

    print("="*20)
    print("Resume Embedding:", resume_embedding[:10])
    print("Job Description Embedding:", job_description_embedding[:10])
    print("="*20)

    distance = np.linalg.norm(resume_embedding - job_description_embedding)
    print("Cosine Similarity Distance:", distance)

    # load data from test_resumes.json
    with open("data_resumes.json", "r") as f:
        resumes = json.load(f)

    resumes = resumes["applicants"]

    # count number of resumes with distance less than the current resume. keep track of top 5 resumes with their text which are not in ascending order
    count = 0
    top_resumes = []
    for resume in resumes:
        if resume["distance"] < distance:
            count += 1
        if len(top_resumes) < 5:
            top_resumes.append(resume)
        else:
            top_resumes = sorted(top_resumes, key=lambda x: x["distance"], reverse=True)
            if resume["distance"] < top_resumes[-1]["distance"]:
                top_resumes[-1] = resume

    print("="*20)
    print("Number of resumes with distance less than the current resume:", count)
    # calculate percent of people with distance less than the current resume
    percent = count / len(resumes) * 100
    print("Percent of people with distance less than the current resume:", percent)
    print("="*20)

    # get the text of the top 5 resumes
    top_5_resumes_text = [resume["text"] for resume in top_resumes]

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "Extract the years of experience from the resume text. Return only a floating point number without any other character.",
            },
            {"role": "user", "content": resume_text},
        ],
    )
    years_of_experience = response.choices[0].message.content

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a recruiter at a company. You completed hiring candidates for the position of a software engineer with the job description {job_description}. Based on the job description, what can the person in {resume_text} improve? Tell what does the resume lack in compared to other 4, without revealing any information about others? The feedback must not contain the name of any person. write in second person, as you are giving feedback. The top 5 resumes selected for this job are:",
            },
            {"role": "user", "content": "\n --- \n".join(top_5_resumes_text)},
        ],
    )

    feedback = response.choices[0].message.content

    linkedin_res = await get_linkedin_score(linkedin_username, job_description)
    tone = linkedin_res[0]
    relevance = linkedin_res[1]
    accomplishments = linkedin_res[2]
    domains = linkedin_res[3]
    gs = await get_git_score(github_username)

    # TODO: add percentiles for github scores, GPA
    # TODO: add languages boolean dict

    new_person = {
        "name": name,
        "email": email,
        "resume_link": resume_link,
        "distance": distance,
        "text": resume_text,
        "vector": list(resume_embedding),
        "github_username": github_username,
        "linkedin_username": linkedin_username,
        "gpa": gpa,
        "work_experience": domains,
        "github_score": gs,
        "linkedin_summary": tone + " " + relevance,
        "linkedin_accomplishments": accomplishments,
        "years_of_experience": years_of_experience,
    }

    resumes.append(new_person)

    # Calculate the running average of GPA, years of experience, and GitHub score
    total_gpa = 0
    total_experience = 0
    total_github_score = 0
    num_applicants = len(resumes)

    for applicant in resumes:
        total_gpa += applicant["gpa"]
        total_experience += float(applicant["years_of_experience"])
        total_github_score += applicant["github_score"]

    average_gpa = total_gpa / num_applicants
    average_experience = total_experience / num_applicants
    average_github_score = total_github_score / num_applicants

    final_data = {
        "job_description": job_description,
        "average_gpa": average_gpa,
        "average_years_of_experience": average_experience,
        "average_github_score": average_github_score,
        "applicants": resumes,
    }

    # store dictionary in a json file
    with open("data_resumes.json", "w") as f:
        json.dump(final_data, f)


    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a recruiter at a Corporation. You completed hiring candidates for the position of a software engineer with the job description {job_description}. Based on the job description, generate a concise 5 line summary for the points in {resume_text} and {relevance}? Mention their GitHub score of {gs} and show how it makes them stand out. Mention if relevant and why relevant: GPA is {gpa}, Domains of experience is {domains}.  The job description is: ",
            },
            {"role": "user", "content": job_description},
        ],
    )

    summary = response.choices[0].message.content
    print(summary)

    print("="*20)

    top_5_resumes_text = [resume["text"] for resume in top_resumes]

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a recruiter at a Corporation. You hiring one candidate for the position of a software engineer with the job description {job_description}. You have received 5 resumes. Based on the job description, why is {resume_text} the best resume compared to other 4 and what is in {resume_text} that is not present in others, without revealing any information about others? The feedback should be a 5 line answer without special characters, and it must not contain the name of any person. Make sure to mention specific details from job description {job_description} that reasons out why Yasir is a good fit. The top 5 resumes are:",
            },
            {"role": "user", "content": "\n --- \n".join(top_5_resumes_text)},
        ],
    )

    best = response.choices[0].message.content
    print(best)

    return percent

