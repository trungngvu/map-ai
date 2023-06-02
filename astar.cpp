#include <bits/stdc++.h>
#include <string>
#include <vector>
#include <queue>
#include <fstream>
#include <unordered_map>
#define MAXN 10005
using namespace std;

// Các điểm
struct Point
{
    double x;
    double y;
    int id;
};

// Các đoạn nối
struct Edge
{
    int start;
    int end;
};

vector<Edge> edges;
vector<Point> points;

// Xử lý data crawl từ file json về
string formatDataInput(string input)
{
    char charToRemove1 = ',';
    char charToRemove2 = '[';
    char charToRemove3 = ']';
    input.erase(remove(input.begin(), input.end(), charToRemove1), input.end());
    input.erase(remove(input.begin(), input.end(), charToRemove2), input.end());
    input.erase(remove(input.begin(), input.end(), charToRemove3), input.end());
    return input;
}

// tính khoảng cách giữa 2 tọa độ bằng căn bình phương
double euclideanDistance(const Point &p1, const Point &p2)
{
    return sqrt(pow(p2.x - p1.x, 2) + pow(p2.y - p1.y, 2));
}

// tìm điểm gần nhất khi người dùng nhập vào
Point findNearestPoint(const Point &target, const vector<Point> &points)
{
    double minDistance = numeric_limits<double>::max();
    Point nearestPoint = points.front();

    for (const auto &point : points)
    {
        double distance = euclideanDistance(target, point);
        if (distance < minDistance)
        {
            minDistance = distance;
            nearestPoint = point;
        }
    }

    return nearestPoint;
}

// Thuật toán A*
vector<Point> aStarAlgorithm(const Point &start, const Point &goal, const vector<Edge> &edges, const vector<Point> &points)
{
    auto comparator = [](const pair<double, Point> &p1, const pair<double, Point> &p2)
    {
        return p1.first > p2.first;
    };

    priority_queue<pair<double, Point>, vector<pair<double, Point>>, decltype(comparator)> openSet(comparator);
    unordered_map<int, double> gScores;
    unordered_map<int, double> fScores;
    unordered_map<int, int> cameFrom;

    openSet.emplace(0.0, start);
    gScores[start.id] = 0.0;
    fScores[start.id] = euclideanDistance(start, goal);

    while (!openSet.empty())
    {
        auto current = openSet.top().second;
        openSet.pop();

        if (current.id == goal.id)
        {
            vector<Point> path;
            int id = current.id;

            while (cameFrom.find(id) != cameFrom.end())
            {
                Point point;
                for (const auto &p : points)
                {
                    if (p.id == id)
                    {
                        point = p;
                        break;
                    }
                }
                path.push_back(point);
                id = cameFrom[id];
            }

            reverse(path.begin(), path.end());
            return path;
        }

        for (const auto &edge : edges)
        {
            if (edge.start == current.id)
            {
                int neighborId = edge.end;

                for (auto &neighbor : points)
                {
                    double tentativeGScore;
                    if (neighbor.id == neighborId)
                    {
                        tentativeGScore = gScores[current.id] + euclideanDistance(current, neighbor);
                        if (gScores.find(neighborId) == gScores.end() || tentativeGScore < gScores[neighborId])
                        {
                            cameFrom[neighborId] = current.id;
                            gScores[neighborId] = tentativeGScore;
                            fScores[neighborId] = tentativeGScore + euclideanDistance(neighbor, goal);
                            openSet.push({fScores[neighborId], neighbor});
                        }
                    }
                }
            }
        }
    }
    return {};
}

void readPoint(const char *filename)
{
    ifstream file(filename);
    string x, y, id;
    while (file >> x)
    {
        if (x == "[")
            continue;
        if (x == "]")
            break;
        file >> y >> id;

        Point point;
        point.x = stod(formatDataInput(x));
        point.y = stod(formatDataInput(y));
        point.id = stoi(formatDataInput(id));
        points.push_back(point);
    }
    file.close();
}
void readRoad(const char *filename)
{
    ifstream file(filename);
    string startPoint, endPoint;
    while (file >> startPoint)
    {
        if (startPoint == "[")
            continue;
        if (startPoint == "]")
            break;
        file >> endPoint;

        Edge edge;
        edge.start = stoi(formatDataInput(startPoint));
        edge.end = stoi(formatDataInput(endPoint));
        edges.push_back(edge);
    }
    file.close();
}
int main()
{
    string inputString;
    getline(cin, inputString);
    istringstream iss(inputString);
    string token;
    vector<double> doubleValues;
    double startX, startY;
    double goalX, goalY;

    while (getline(iss, token, ','))
    {
        double value = stod(token);
        doubleValues.push_back(value);
    }
    startX = doubleValues[0];
    startY = doubleValues[1];
    goalX = doubleValues[2];
    goalY = doubleValues[3];

    readPoint("./src/data/point.json");
    readRoad("./src/data/road.json");
    Point startPoint = findNearestPoint({startX, startY}, points);
    Point goalPoint = findNearestPoint({goalX, goalY}, points);
    vector<Point> path = aStarAlgorithm(startPoint, goalPoint, edges, points);

    if (!path.empty())
    {
        for (const auto &point : path)
        {
            cout << point.id << ",";
            ;
        }
        cout << endl;
    }
    else
    {
        cout << "No road" << endl;
    }

    return 0;
}
