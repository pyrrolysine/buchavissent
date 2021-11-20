#!/usr/bin/python3

with open('table', mode = 'r', encoding = 'utf-8') as fd:
    lines = list(set(fd.readlines()))
    header = list(filter(lambda x: x[0] == 'x', lines))[0].strip().split()

owned = {}
with open('owners', mode = 'r') as fd:
    for line in fd:
        try:
            x, y, owner = line.strip().split()
            owned[(x, y)] = owner
            print('Owner {} of {}:{}'.format(owner, x, y))
        except:
            print('Invalid owner: ' + line.strip())

print(len(owned), 'owned places')

for i, line in enumerate(lines):
    try:
        parts = line.strip().split()
        x = parts[0]
        y = parts[1]
        if (x, y) in owned:
            lines[i] = line[:line.rfind('--')] + owned[(x, y)] + '\n'
            print('Owner', owned[(x, y)], 'of', x, y)
    except:
        pass

with open('table_owned', mode = 'w', encoding = 'utf-8') as fd:
    for line in lines:
        fd.write(line)

SUBST = [
    ('_', ' '),
    ('"', '\\"'),
]

def subst(string):
    for k, v in SUBST:
        string = string.replace(k, v)
    return string

with open('table.js', mode = 'w', encoding = 'utf-8') as fd:
    fd.write('[\n')
    for line in lines:
        if line[0] == '\n': continue
        fd.write('\t{' + ','.join('"{}": "{}"'.format(k, subst(v)) for k, v in zip(header, line.strip().split())) + '},\n')
    fd.write(']\n\n')

print(len(lines), 'places stored')

