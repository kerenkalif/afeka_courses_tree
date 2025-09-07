import os
import docx
import re
import json

def extract_info_from_docx(filepath):
    # טוען טקסט מהקובץ
    try:
        doc = docx.Document(filepath)
        text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    except Exception as e:
        return None, f"בעיה בקריאת קובץ: {e}"

    # חיפושי REGEX
    code_match = re.search(r"מספר קורס\\W*(\\d{4,6})", text)
    name_match = re.search(r"שם קורס\\W*([-\\w\\sא-ת]+)", text)

    # תנאי קדמים - כל קוד שמופיע אחרי קדם/קדם:
    prereq_lines = [l for l in text.split('\\n') if 'קדם' in l]
    prerequisites = []
    for line in prereq_lines:
        # תופס מספרי קורס
        codes = re.findall(r"(\\d{4,6})", line)
        prerequisites.extend(codes)

    course = {
        "file": os.path.basename(filepath),
        "code": code_match.group(1) if code_match else "",
        "name": name_match.group(1).strip() if name_match else "",
        "prerequisites": list(set(prerequisites)),  # מסיר כפילויות
        "department": "",
        "year": "",
        "semester": "",
        "syllabus": os.path.basename(filepath)
    }
    # לכי לוג פשוט
    log = f"{filepath} | code: {course['code']} | name: {course['name']}"
    return course, log

def main():
    dir_path = input("הזן נתיב לספריית סילבוסים (docx): ").strip()
    files = [f for f in os.listdir(dir_path) if f.lower().endswith('.docx')]

    courses = []
    logs = []

    for fname in files:
        fpath = os.path.join(dir_path, fname)
        course, log = extract_info_from_docx(fpath)
        if course:
            courses.append(course)
        logs.append(log)
        print(log)

    # שם לקובץ ה-JSON
    json_name = input("איך לקרוא לקובץ JSON? [courses.json]: ").strip() or "courses.json"
    with open(json_name, 'w', encoding='utf-8') as fp:
        json.dump(courses, fp, ensure_ascii=False, indent=2)
    print(f"\nנשמר {json_name} ({len(courses)} קורסים)!")

    with open('extract_log.txt', 'w', encoding='utf-8') as lp:
        lp.write('\n'.join(logs))
    print("קובץ לוג extract_log.txt נוצר.")

if __name__ == "__main__":
    main()
