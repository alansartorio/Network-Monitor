from check import check_internet

from datetime import datetime
from time import sleep




import http.server

def runServer():
    def getHandler(*args, **kwargs):
        return http.server.SimpleHTTPRequestHandler(*args, **kwargs, directory='static')

    with http.server.HTTPServer(("", 9090), getHandler) as server:
        print("Server is running.")
        server.serve_forever()


import multiprocessing
p = multiprocessing.Process(target = runServer, args=())
p.start()

def log():
    print('logging')
    now = datetime.now().isoformat()
    value = check_internet(timeout=1)
    with open('static/data.csv', 'a') as file:
        file.write(f'{now},{int(value)}\n')
    return value

while True:
    v = log()
    if not v:
        while not v:
            sleep(5)
            v = log()
    sleep(20)
