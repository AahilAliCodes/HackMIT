from linkedin_api import Linkedin
from openai import OpenAI
import json
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_linkedin_score(username: str, job_description: str) -> list:
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
                "content": "What does this person post regularly about? What domain is this person interested in, and experienced in? What type of content do they share? Generate a concise answer to these questions. Use only text, no other symbols. Do not use quotation marks. The following is all the posts from their Linkedin profile.",
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
                "content": f"You are a recruiter at a Corporation. You hiring one candidate for the position of a software engineer with the job description {job_description}. Use only text, no other symbols. Do not use quotation marks. What content of the following linkedin posts is relevant to the job description?",
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
                "content": f"You are a recruiter at a Corporation. You hiring one candidate for the position of a software engineer with the job description {job_description}. Use only text, no other symbols. Do not use quotation marks. Generate a comma-separated list of accomplishments, awards, and projects from the following posts that may or may not be relevant to the job description but show the efforts put in.",
            },
            {"role": "user", "content": all_posts},
        ],
    )
    accomplishments = response.choices[0].message.content

    return [tone, relevance, accomplishments, domains]

jd = "\nQorvo\u2019s Internship Program is designed for college students currently enrolled in an accredited Bachelor\u2019s, Master\u2019s, or PhD program. Qorvo offers real work experience, exposure to upper management, and the opportunity to pursue full time opportunities, as available.\n\n \n\nQorvo\u2019s Internship Program offers:\n\nChallenging, skill-building assignments\nMentoring and coaching from industry experts\nLunch & Learns and other learning opportunities\nCollaborative team-based work environment\nNetworking and social events\nFinal presentation to business leaders\n \n\nQorvo\u2019s Software Engineering Internships are offered in our High Performance Analog, Advanced Cellular, and Connectivity and Sensors business groups. Specific projects and responsibilities will be determined based on the business needs at the time of the internship assignment.\n\n \n\nResponsibilities may include:\n\nStreamlining application and software processes\nDeveloping and maintaining software for various projects\nBenchmarking various software to maximize efficiency and develop improvements\nDriving API development to support data structure, data access, data integration, data visualization, database design and implementation\nDocumenting and reporting following the team's design practices\nProviding comprehensive support to internal customers and achieving resolution to outstanding problems or issues\n \n\nQualifications:\n\nCurrently pursuing a BS, MS, or PhD in Computer Science or Electrical Engineering\nMinimum GPA of 3.0\nCompetence using XML/HTML/C# Java or Python C++\nExcellent debugging and problem solving skills\nFamiliarity/understanding of IEDs, mutithreading paradigms, shell scripting, algorithms and data-structures\nProficiency with Microsoft Office (Excel, Word, PowerPoint)\nSelf-starter with strong written and verbal communication skills \nStrong organization skills and attention to detail\n"

out = get_linkedin_score("katlimq", jd)

print(out)