import dotenv from "dotenv";

dotenv.config();

async function fetchContributions(
  username: string,
  languages: string[],
  token: string
) {
  try {
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${token} `,
        },
      }
    );
    const repositories: any = await reposResponse.json();

    const contributionsPerLanguage: { [key: string]: number } = {};

    for (const repo of repositories) {
      if (languages.includes(repo.language)) {
        const language = repo.language;

        const repoContributionsResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/languages`,
          {
            method: "GET",
            headers: { Authorization: `token ${token}` },
          }
        );
        const repoContributions: { [key: string]: number } =
          await repoContributionsResponse.json();

        contributionsPerLanguage[language] = Object.values(
          repoContributions
        ).reduce((acc: number, val: number) => acc + val, 0);
      }
    }

    console.log("Contributions per language:", contributionsPerLanguage);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const username = "thatbeautifuldream";
const languages = ["JavaScript", "TypeScript", "Python"];
const token = process.env.GITHUB_TOKEN as string;
fetchContributions(username, languages, token);
