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

with open('nonces.js', mode = 'w', encoding = 'utf-8') as fd:
    fd.write('{\n')
    for n, x_y in enumerate(owned.keys(), start = 1):
        x, y = x_y
        fd.write('\t"{}w{}": "{}",\n'.format(x, y, hex(n)[2:].rjust(4, '0')))
    fd.write('\t"": 0\n')
    fd.write('}\n\n')

print(len(lines), 'places stored')

