/**
 * Raw code strings for boilerplate templates (avoids nested template literals in boilerplates.ts).
 */

export const PANDAS_CSV_SYNTAX =
    "import pandas as pd\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    n = int(data[0])\n    rows = [line.split(\",\") for line in data[1:1+n]]\n    df = pd.DataFrame(rows, columns=[\"name\", \"score\"])\n    df[\"score\"] = df[\"score\"].astype(int)\n\n    # TODO: implement challenge logic\n    print(df[\"score\"].mean())\n\nif __name__ == \"__main__\":\n    solve()\n";

export const PANDAS_READ_CSV_SYNTAX =
    "import pandas as pd\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    n = int(data[0])\n    rows = [line.split(\",\") for line in data[1:1+n]]\n    df = pd.DataFrame(rows, columns=[\"name\", \"score\"])\n    df[\"score\"] = df[\"score\"].astype(int)\n\n    # TODO: print average score\n    print(df[\"score\"].mean())\n\nif __name__ == \"__main__\":\n    solve()\n";

export const PANDAS_GROUPBY_LOGIC =
    "import pandas as pd\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    n = int(data[0])\n    rows = [line.split(\",\") for line in data[1:1+n]]\n    df = pd.DataFrame(rows, columns=[\"dept\", \"name\", \"score\"])\n    df[\"score\"] = df[\"score\"].astype(int)\n\n    # TODO: print mean score per department\n    result = df.groupby(\"dept\")[\"score\"].mean()\n    for dept, val in result.items():\n        print(f\"{dept},{val}\")\n\nif __name__ == \"__main__\":\n    solve()\n";

export const PANDAS_FILTER_LOGIC =
    "import pandas as pd\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    n = int(data[0])\n    rows = [line.split(\",\") for line in data[1:1+n]]\n    df = pd.DataFrame(rows, columns=[\"name\", \"score\"])\n    df[\"score\"] = df[\"score\"].astype(int)\n\n    # TODO: print rows where score >= 60\n    passed = df[df[\"score\"] >= 60]\n    print(passed.to_string(index=False, header=False))\n\nif __name__ == \"__main__\":\n    solve()\n";

export const PANDAS_MERGE_SEMANTIC =
    "import pandas as pd\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    n = int(data[0])\n    rows = [line.split(\",\") for line in data[1:1+n]]\n    df = pd.DataFrame(rows, columns=[\"id\", \"name\"])\n    m = int(data[1 + n])\n    rows2 = [line.split(\",\") for line in data[2+n:2+n+m]]\n    df2 = pd.DataFrame(rows2, columns=[\"id\", \"score\"])\n    df2[\"score\"] = df2[\"score\"].astype(int)\n\n    # TODO: merge on id and print name, score\n    merged = df.merge(df2, on=\"id\")\n    print(merged.to_string(index=False, header=False))\n\nif __name__ == \"__main__\":\n    solve()\n";

export const OOPS_CLASS_SYNTAX =
    "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def greet(self):\n        return f\\\"Hi, I am {self.name}\\\"\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    name, age = data[0].strip().split(\",\")\n    p = Person(name, int(age))\n    print(p.greet())\n\nif __name__ == \"__main__\":\n    solve()\n";

export const OOPS_INHERITANCE_LOGIC =
    "class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return \"...\"\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed\n\n    def speak(self):\n        return \"Woof\"\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    name, breed = data[0].strip().split(\",\")\n    d = Dog(name, breed)\n    print(d.speak())\n\nif __name__ == \"__main__\":\n    solve()\n";

export const OOPS_MUTABLE_DEFAULT_SEMANTIC =
    "class Counter:\n    def __init__(self, start=0):\n        self.value = start\n\n    def inc(self):\n        self.value += 1\n        return self.value\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    n = int(data[0])\n    c = Counter()\n    for _ in range(n):\n        c.inc()\n    print(c.value)\n\nif __name__ == \"__main__\":\n    solve()\n";

export const CP_RANGE_SYNTAX =
    "def solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    n = int(data[0])\n    total = 0\n    for i in range(n):\n        total += int(data[1 + i])\n    print(total)\n\nif __name__ == \"__main__\":\n    solve()\n";

export const CP_SLICE_LOGIC =
    "def solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    n = int(data[0])\n    arr = [int(x) for x in data[1].strip().split()]\n    # TODO: print sum of first n elements\n    print(sum(arr[:n]))\n\nif __name__ == \"__main__\":\n    solve()\n";

export const CP_DIVISION_SEMANTIC =
    "def solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if not data:\n        return\n    a, b = int(data[0]), int(data[1])\n    # TODO: integer division and remainder\n    print(a // b, a % b)\n\nif __name__ == \"__main__\":\n    solve()\n";

export const CRYPTO_HASH_SYNTAX =
    "import hashlib\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip()\n    if not data:\n        return\n    h = hashlib.sha256(data.encode(\"utf-8\")).hexdigest()\n    print(h)\n\nif __name__ == \"__main__\":\n    solve()\n";

export const CRYPTO_COMPARE_LOGIC =
    "import hashlib\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip().splitlines()\n    if len(data) < 2:\n        return\n    a, b = data[0].strip(), data[1].strip()\n    ha = hashlib.sha256(a.encode(\"utf-8\")).hexdigest()\n    hb = hashlib.sha256(b.encode(\"utf-8\")).hexdigest()\n    print(\"same\" if ha == hb else \"different\")\n\nif __name__ == \"__main__\":\n    solve()\n";

export const CRYPTO_CONSTANT_TIME_SEMANTIC =
    "import hashlib\nimport secrets\n\ndef solve():\n    import sys\n    data = sys.stdin.read().strip()\n    if not data:\n        return\n    token = secrets.token_hex(16)\n    h = hashlib.sha256((data + token).encode(\"utf-8\")).hexdigest()\n    print(h)\n\nif __name__ == \"__main__\":\n    solve()\n";
