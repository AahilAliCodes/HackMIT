import openai
import numpy as np
import os
import pymupdf
from dotenv import load_dotenv
import requests
import json

load_dotenv()
client = openai.Client(api_key=os.getenv("OPENAI_API_KEY"))


def get_embedding(text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding


def get_text_from_pdf(pdf_path):
    pdf = pymupdf.open(pdf_path)
    text = ""
    for page in pdf:
        text += page.get_text()
    return text


def get_github_username(resume_text):
    # prompt chatgpt very clearly to only return the github username from the resume
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "Extract the GitHub username from the resume text. Return only the username without any other character. Return NOT_FOUND if no username is found.",
            },
            {"role": "user", "content": resume_text},
        ],
    )
    return response.choices[0].message.content


def get_pdf_from_link(link: str):
    response = requests.get(link)
    with open("resume.pdf", "wb") as f:
        f.write(response.content)
    return "./resume.pdf"


def predict_chances(name: str, resume_link: str, job_description: str):
    resume_path = get_pdf_from_link(resume_link)
    resume_text = get_text_from_pdf(resume_path)
    print(resume_text)
    resume_embedding = np.array(get_embedding(resume_text))  # Convert to numpy array

    job_description_embedding = np.array(
        get_embedding(job_description)
    )  # Convert to numpy array

    # calculate the distance between the resume and the job description
    distance = np.linalg.norm(resume_embedding - job_description_embedding)

    # load test_resumes.json
    # get the top 5 resumes with the least distance to the job description
    with open("test_resumes.json", "r") as f:
        test_resumes = json.load(f)

    top_5_resumes = sorted(
        test_resumes,
        key=lambda x: np.linalg.norm(get_embedding(x) - job_description_embedding),
    )[:5]

    top_5_resumes_text = [
        get_text_from_pdf(get_pdf_from_link(resume)) for resume in top_5_resumes
    ]
    all_distances = np.array(
        [
            np.linalg.norm(
                get_embedding(get_text_from_pdf(get_pdf_from_link(resume)))
                - job_description_embedding
            )
            for resume in top_5_resumes
        ]
    )

    # return the percentile of the distance in all distances
    percentile = np.percentile(all_distances, distance)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a recruiter at a Corporation. You completed hiring candidates for the position of a software engineer with the job description {job_description}. Based on the job description, what can the person in {resume_text} improve? Tell what does the resume lack in compared to other 4, without revealing any information about others? The feedback must not contain the name of any person. The top 5 resumes selected for this job are:",
            },
            {"role": "user", "content": "\n --- \n".join(top_5_resumes_text)},
        ],
    )

    feedback = response.choices[0].message.content

    return [percentile, feedback]


name = "Aryan"

resume_link = "https://utfs.io/f/VpCDIDL5swAaiN4JnhjZV8NtgvCjxzUDSa0I2kqwJMlHR13m"

job_description = "We are looking for a software engineer with experience in Python and FastAPI. The candidate should have experience in building web applications and should be able to work in a team."

out = predict_chances(name, resume_link, job_description)

print("Percentile:", out[0])
print("Feedback:", out[1])
