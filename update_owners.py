#!/usr/bin/python3

import os

with open('minters', mode = 'r') as fd:
    minters = fd.readlines()

with open('owners', mode = 'r') as fd:
    lines = fd.readlines()

with open('nonces.js', mode = 'r') as fd:
    nonces = eval(fd.read().strip())

owners = {}

for line in minters:
    try:
        lon, lat, addr = line.strip().split()
        owners[(lon, lat)] = addr
    except:
        pass


modified = False

for line in lines:
    try:
        lon, lat, addr = line.strip().split()
        addr = addr.strip()

        id = lon + 'w' + lat
        nonce = nonces[id].lstrip('0')
        if len(nonce) & 1 == 1: nonce = '0' + nonce

        with os.popen('curl --silent https://devnet-api.elrond.com/nfts/PUZ-8b69ec-' + nonce + '/owners -H "Accept: application/json"') as pipe:
            data = pipe.read().strip()
            try:
                new_addr = eval(data)[0]['address'].strip()
                if new_addr != addr:
                    modified = True
                    print(id, '--', nonce)
                    print('\tFROM: ' + addr)
                    print('\t  TO: ' + new_addr)
                    addr = new_addr
            except:
                addr = 'BURNED'
        owners[(lon, lat)] = addr
    except:
        pass

if modified or len(owners) != len(lines):
    with open('owners', mode = 'w') as fd:
        for k, addr in owners.items():
            lon, lat = k
            fd.write('%s %s %s\n' % (lon, lat, addr))

    with open('owners.js', mode = 'w') as fd:
        fd.write('{\n')
        for k, addr in owners.items():
            lon_w_lat = k[0] + 'w' + k[1]
            fd.write('\t"{}": "{}",'.format(lon_w_lat, addr))
        fd.write('\t"":""\n')
        fd.write('}\n')

    os.system('./apply_ownership.py')

