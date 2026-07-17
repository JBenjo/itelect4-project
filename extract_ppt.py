import zipfile, re
p = 'ITELECT4_Session3_React_TypeScript_Components.pptx'
with zipfile.ZipFile(p) as z:
    names = [n for n in z.namelist() if n.startswith('ppt/slides/slide') and n.endswith('.xml')]
    for name in sorted(names):
        data = z.read(name).decode('utf-8', errors='ignore')
        text = re.sub(r'<[^>]+>', ' ', data)
        text = re.sub(r'\s+', ' ', text).strip()
        if text:
            print('---' + name + '---')
            print(text[:8000])
            print()
