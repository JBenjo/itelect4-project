import zipfile, re, os
p = 'ITELECT4_Session2_TypeScript_Advanced_Types.pptx'
with zipfile.ZipFile(p) as z:
    names = [n for n in z.namelist() if n.startswith('ppt/slides/slide') and n.endswith('.xml')]
    for name in sorted(names):
        data = z.read(name).decode('utf-8', errors='ignore')
        text = re.sub(r'<[^>]+>', ' ', data)
        text = re.sub(r'\s+', ' ', text).strip()
        if text:
            print('---' + name + '---')
            print(text[:6000])
            print()
