import datetime
import os
import sys
import subprocess


def new_blog(title):
    now = datetime.datetime.now()
    year = f"{now.year}"
    month = f"{now.month}".zfill(2)
    day = f"{now.day}".zfill(2)
    filepath = f"./content/posts/{year}-{month}-{day}---{title}.md"
    with open(filepath, "w") as lines:
        lines.write("---\n")
        lines.write("template: post\n")
        lines.write("title: \"\"\n")
        lines.write(f"slug: {sys.argv[1]}\n")
        lines.write("socialImage: /media/nophoto.png\n")
        lines.write("draft: false\n")
        lines.write(f"date: {now.isoformat()}\n")
        lines.write("description: \"\"\n")
        lines.write("category: Article\n")
        lines.write("tags:\n")
        lines.write("  - \"Gadget\"\n")
        lines.write("---\n")
        lines.write("\n")
    return filepath

if __name__ == "__main__":
    filepath = new_blog(sys.argv[1])
    subprocess.run(f"code {filepath}", shell=True)