# File: extract_cv.py

input_path = "/home/syslord1/REPO1/note1.md"
output_path = "/home/syslord1/REPO1/cv/backend1/cv.md"

with open(input_path, "r", encoding="utf-8") as f:
    text = f.read()

start_marker = "[CV-START]"
end_marker = "[CV-END]"

start = text.find(start_marker)
end = text.find(end_marker)

if start != -1 and end != -1 and end > start:
    # Move start to after the marker and any following newline
    start += len(start_marker)
    # Optionally strip leading/trailing whitespace/newlines
    cv_content = text[start:end].lstrip("\n").rstrip()
    with open(output_path, "w", encoding="utf-8") as out:
        out.write(cv_content)
    print("CV section extracted (without markers) and written to", output_path)
else:
    print("CV section not found or malformed.")