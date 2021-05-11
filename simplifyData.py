
from typing import List


class Point:
    def __init__(self, x: str, y: int):
        self.x, self.y = x, y

    @classmethod
    def fromString(cls, str):
        x, y = str.split(',')
        x, y = x.strip(), int(y.strip())
        if y != 0 and y != 1:
            raise Exception(f"Y value must be either 0 or 1, but was: {y}")
        return cls(x, y)
    
    def toString(self):
        return f'{self.x},{self.y}'

    def __repr__(self):
        return self.toString()

def simplify(data: List[Point]):
    out = [data[0]]
    for i in range(1, len(data)):
        if data[i - 1].y != data[i].y:
            out.append(data[i])
    out.append(data[-1])
    return out


points = []
with open('static/data.csv', 'r') as dataFile:
    for line in dataFile.readlines():
        points.append(Point.fromString(line))

points = simplify(points)

with open('static/data-simplified.csv', 'w') as dataFile:
    for point in points:
        dataFile.write(point.toString() +'\n')