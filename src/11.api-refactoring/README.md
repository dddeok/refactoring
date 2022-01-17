## API 리팩터링

> **모듈과 함수는 소프트웨어를 구성하는 빌딩 블록이며, API는 이 블록들을 끼워 맞추는 연결부다.**

- 좋은 API는 데이터를 갱신하는 함수와그저조회만 함수를 명확히 구분해야한다.

1. 질의 함수와 변경 함수 분리하기
2. 함수 매개변수화 하기
3. 플래그 인수 제거하기
4. 객체 통째로 넘기기
5. 질의 함수로 바꾸기
6. 질의 함수를 매개변수로 바꾸기
7. 세터 제거하기
8. 생성자를 패터리 함수로 바꾸기
9. 함수를 명령으로 바꾸기
10. 명령을 함수로 바꾸기
11. 수정된 값 반환하기
12. 오류코드를 예외로 바꾸기
13. 예외를 사전 확인으로 바꾸기

### 11.1 질의 함수와변경 함수 분리하기

```jsx
function getTotalOutstandingAndSendBill() {
  const result = customer.invoices.reduce(
    (total, each) => each.amount + total,
    0
  );
  sendBill();
  return result;
}

function totalOutstanding() {
  return customer.invoices.reduce((total, each) => each.amount + total, 0);
}

function sendBill() {
  emailGateway.send(formatBill(customer));
}
```

**외부에서 관찰 할 수 있는 겉보기 부수효과(observable side effect)가 전혀 없이 값을 반환해주는 함수를 추구해야한다.**

- 어느때건 원하는 만큼 호출해도 문제가 없다.
- 질의 함수(읽기 함수)는 모두 부수효과가 없어야한다라는 규칙을 따르는것을 장려한다.
- 명령-질의 분리 (command-query seperation)

**절차**

1. 대상 함수를 복제하고 질의 목적에 충실한 이름을 짓는다.
2. 새 질의 함수에서 부수효과를 모두 제거한다.
3. 정적 검사를 수행한다.
4. 원래 함수(변경 함수)를 호출하는 곳을 모두 찾아낸다. 호출하는 곳에서 반환 값을 사용한다면 질의 함수를 호출하도록 바꾸고, 원래 함수를 호출하는 코드를 바로 아래 줄에 새로 추가한다. 하나 수정할 때마다 테스트한다.
5. 원래 함수에서 질의 관련 코드를 제거한다.
6. 테스트한다.

### 11.2 함수 매개변수화하기

```jsx
function tenPercentRaise(aPerson) {
	aPerson.salary = aPerson.salary.multiply(1.1);
}

function fivePercentRaise(aPerson) {
	aPerson.salary = aPerson.salary.multiply(1.05);
}

fucntion raise(aPerson, factor) {
	aPerson.salary = aPerson.salary.multiply(1 + factor);
}
```

**두 함수의 로직이 아주 비슷하고 단지 리터럴 값만 다르다면, 그 다른 값만 매개변수로 받아 처리하는 함수 하나로 합쳐서 중복을 없앨 수 있다.**

**절차**

1. 비슷한 함수 중 하나를 선택한다.
2. 함수 선언 바꾸기로 리터럴들을 매개변수로 추가한다.
3. 이 함수를 호출하는 곳 모두에 적적한 리터럴 값을 추가한다.
4. 테스트한다.
5. 매개변수로 받은 값을 사용하도록 함수 본문을 수정한다. 하나 수정할 때마다 테스트한다.
6. 비슷한 다른 함수를 호출하는 코드를 찾아 매개변수화된 함수를 호출하도록 하나씩 수정한다. 하나 수정할 때마다 테스트한다.

### 11.3 플래그 인수 제거하기

```jsx
function setDimension(name, value) {
  if (name === "height") {
    this._height = value;
    return;
  }
  if (name === "width") {
    this._width = value;
    return;
  }
}

function setHeight(value) {
  this._height = value;
}
function setWidth(value) {
  this._width = value;
}
```

**플래그 인수(flag argument)란 호출되는 함수가 실행할 로직을 호출하는 쪽에서 선택하기 위해 전달하는 인수다.**

- 호출하는 함수 있는 함수들이 무엇이고 어떻게 호출 해야하는 지를 이해하기 어려워 진다.
- 호출되는 함수는 그 인수를 제어 흐름을 결정하는데 사용해야한다.
- 적절한 플래그 인수는, 중복 코드를 제어할 수 있는데 도움이 될 수 있다고 생각한다. (본인 생각)
  - 명시적인 부분에 있어, 플래그 인수를 제거하는 것이 많은 도움이 되는것은 인지를 하고 있으나, 플래그 인수에 의한 장점도 있을 것이라 생각한다.

**절차**

1. 매개변수로 주어질 수 있는 값 각각에 대응하는 명시적 함수들을 생성한다.
2. 원래 함수를 호출하는 코드들을 모두 찾아서 각 리터럴 값에 대응되는 명시적 함수를 호출하도록 수정한다.

### 11.4 객체 통째로 넘기기

```jsx
const low = aRoom.dayTempRange.low;
const hight = aRoom.dayTempRange.high;
if (aPlan.withinRange(low, high))

if (aPlan.withinRange(aRoom.dayTempRange)
```

**하나의 레코드에서 값 두어개를 가져와 인수로 넘기는 코드를 보면, 그 값들 대신 레코드를 통째로 넘기고 함수 본문에서 필요한 값들을 꺼내 쓰도록 수정한다.**

- 레코드에 담긴 데이터 중 일부를 받는 함수가 여러개라면, 중복이 존재 할 수 있고 레코드를 통째로 넘긴다면 이런 중복 로직 또한 제거가 가능하다.
- 레코드와 함수가 서로 다른 모듈에 속한 상황이라면 주의해야한다.

**절차**

1. 매개 변수들을 원하는 형태로 받는 빈 함수를 만든다.
2. 새함수의 본문에서 원래 함수를 호출하도록 하며, 새 매개변수와 원래 함수의 매개변수를 매핑한다.
3. 정적 검사를 수행한다.
4. 모든 호출자가 새 함수를 사용하게 수정한다. 하니씩 수정하며 테스트하자
5. 호출자를 모두 수정했다면 원래 함수를 인라인 한다.
6. 새 함수의 이름을 적절히 수정하고 모든 호출자에 반영한다.

### 11.5 매개변수를 질의 함수로 바꾸기

```jsx
availableVacation(anEmployee, anEmployee.grade);

function availableVacation(anEmployee, grade) {
	...
}

availableVacation(anEmployee);

function availableVacation(anEmployee) {
	const grade = anEmployee.grade;
	// 연휴 계산 ..
}
```

**매개변수 목로은 함수의 변동 요인을 모아놓은 곳이다.**

- 목록에서도 중복은 피하는게 좋으며 짧을수록 이해하기 쉽다.
- 피호출 함수가 스스로 '쉽게' 결정할 수 있는 값을 매개변수로 건네는 것도 일종의 중복이다.
- 피호출함수에 원치 않는 의존성이 생기는것은 주의해야한다.
- 대상 함수가 참조 투명(referential transparency) 해야 한다.
  - 함수에 똑같은 값을 건네 호출하면 함상 똑같이 동작한다.

**절차**

1. 필요하다면 대상 매갠변수의 값을 계산하는 코드를 별도 함수로 추출해놓는다.
2. 함수 본문에서 대상 매개변수로의 참조를 모두 찾아서 그 매개변수의 값을 만들어주는 표현식을 참조하도록 바꾼다. 하나 수정할 때마다 테스트한다.
3. 함수 선언 바꾸기로 대상 매개변수를 없앤다.

### 11.6 질의 함수를 매개변수로 바꾸기

```jsx
targetTemperature(aPlan)

function targetTemperature(aPlan) {
	currentTemperature = thermostat.currentTemperature;
}

targetTemperature(aPlan, thermostat.currentTemperature);

function targetTemperature(aPlan, currentTemperature) {
	...
}

```

**함수 안데 두기엔 거북한 참조를 발견할 때가 있다.**

- 전역 변수를 참조한다거나(같은 모듈에 안에서라도) 제거하길 원하는 원소를 참조하는 경우가 여기에 속한다.
- 참조를 풀어내는 책임을 호출자로 옮겨 해결 할 수 있다.
- 정답은 없다, 프로그램을 더 잘 이해하게 됐을 때 더 나은 쪽으로 개선하기 쉽게 설계해야한다.
- 모듈을 개발할 때 순수함수들을 따로구분하고 , 프로그램의 입출력과 기타 가변원소들을 다루는 로직으로 순수함수들의 겉을 감싸는 패턴을 많이 활용한다.

**절차**

1. 변수 추출하기로 질의 코드를 함수 본문의 나머지 코드와 분리한다.
2. 함수 본문 중 해당 질의를 호출하지 않는 코드들을 별도 함수로 추출한다.
3. 방금 만든 변수를 인라인하여 제거한다.
4. 원래 함수도 인라인 한다.
5. 새 함수의 이름을 원래 함수의 이름으로 고쳐준다.

<aside>
💡 **자바 스크립트와 불변 클래스**
자바스크립트의 클래스 모델에서는 객체안의 데이터를 직접 얻어낼 방법이 항상 존재하며, 불변 클래스임을 보장하는 수단이 없다는 문제가 있다.
하지만 불변으로 설계했음을 알리고 그렇게 사용하라고 제안하는 것만으로, 충분한 값어치를 한다.
클래스에 불변 성격을 부여하는 건 훌륭한 전략이며, 질의 함수를 매개변수 바꾸기 리팩터링은 이전략을 실행하는데 큰 도움이 된다.

</aside>

### 11.7 세터 제거하기

```jsx
class Person {
	get name() {...}
	set name(aString) {...}
}

class Person {
	get name() {...}
}
```

**세터 메서드가 있다고 함은 필드가 수정될 수 있다는 뜻이다.**

- 수정하지 않겠다는 의도가 명명백백해지고, 변경될 가능성이 봉쇄된다.
- 사람들이 무조건 접근자 메서드를 통해서만 필드를 다루려 할때.
- 클라이언트에서생성 스크립트를 사용해 객체를 생성할 때.

**절차**

1. 설정해야 할 값을 생성자에서 받지 않는다면 그 값을 받을 매개변수를 생성자에 추가한다. 그런 다음 생성자 안에서 적절한 세터를 호출한다.
2. 생성자 밖에서 세터를 호출하는 곳을 찾아 제거하고, 대신 새로운 생성자를 사용하도록 한다. 하나 수정할 때 마다 테스트한다.
3. 세터 메서드 인라인 한다. 가능하다면 해당 필드를 불변으로 만든다.
4. 테스트 한다.

### 11.8 생성자를 팩터리 함수로 바꾸기

```jsx
leadEngineer = new Employee(document.leadEngineer, "E");

leadEngineer = createEngineer(document.leadEngineer);

function createEngineer(engineer) {
  return new Employee(engineer, "E");
}
```

**객체 지향 언어에서 제공하는 생성자는 객체를 초기화하는 특별한 용도의 함수다.**

- 일반함수에 없는 이상한 제약이 따라 붙기도한다.
- 정의한 클래스의 인스턴스를 반환해야하며, 서브클래스의 인스턴스나 프락시를 반활 할 수는 없다.

**절차**

1. 팩터리 함수를 만든다. 팩터리 함수의 본문에서 원래 생성자를 호출한다.
2. 생성자를 호출하던 코드를 팩터리 함수 호출로 바꾼다.
3. 하나씩 수정할 때마다 테스트한다.
4. 생성자의 가시 범위가 최소가 되도록 제한한다.

- **팩터리 함수에 목적(타입)을 녹이는 방식을 권한다고 한다**

### 11.9 함수를 명령으로 바꾸기

```jsx
function score(canidate, medicalExam, scoringGuide) {
	let reulst = 0;
	let healthLevel = 0;
	...
}

class Scoer {
	constructor(candidate, medicaExam, scoringGuide) {
		this._candidate = candidate;
		this._medicalExam = medicalExam;
		this._scoringGuide = scoringGuide;
	}

	execute() {
		this._result = 0;
		this._healthLevel =0;
		...
	}
}
```

**함수 (독립된 함수든 객체에 소속된 메서드든)는 프로그래밍의 기본적인 빌딩 블록 중 하나다.**

- 그 함수만을 위한 객체 안으로 캡슐화하면 더 유용해지는 상황이 있다.
- 명령 객체 혹은 단순히 명령(Command)라고 한다.
- 보조연산을 제공할 수 있으며, 수명주기를 더 정밀하게 제어하는데 필요한 매개변수를 만들어주는 메서드도 제공할 수 있다.
- 상속과 훅을 이용해 사용자 맞춤형으로 만들 수 있다.
- **유연성은 복잡성을 키우고 얻는 대가임을 주의해야한다.**

**절차**

1. 대상 함수의 긴으을 옮길 빈 클래스를 만든다. 클래스 일므은 함수 이름에 기초해 짓는다.
2. 방금 생성한 빈 클래스로 함수를 옮긴다.
3. 함수의 인수들 각가은 명령의 필드로 만들어 생성자를 통해 설정할지 고민해본다.

### 11.10 명령을 함수로 바꾸기

```jsx
class ChargeCacluator {
  constructor(customer, usage) {
    this._customer = customer;
    this._usage = usage;
  }
  execute() {
    return this._customer.rate * this._usage;
  }
}

function charge(customer, usage) {
  return customer.rate * usage;
}
```

**명령 객체는 복잡한 연산을 다룰 수 있는 강력한 메커니즘을 제공한다.**

- 하지만 로직이 크게 복잡하지 않다면 명령 객체는 장점보다 단점이 크니 평범한 한수로 바꿔주는게 낫다.
  - 현재 리액트 함수형 기반의 프로그래밍에서는 커스텀 훅을 사용하는 부분이 종종 존재하는데, 그와 비슷한 케이스에 적용해 볼 수 있음.

**절차**

1. 명령을 생성하는 코드와 명령의 실행 메서드들 호출하는 코드를 함께 함수로 추출한다.
2. 명령의 실행 함수가 호출하는 보조 메서드들을 각각 인라인한다.
3. 함수 선언 바꾸기를 적용하여 생성자와 매개변수 모두를 명령의 실행 메서드로 옮긴다.
4. 명령의 실행 메서드에서 참조하는 필드들 대신 대응하는 매개변수를 사용하게끔 바꾼다. 하나씩 수정할 때마다 테스트한다.
5. 생성자 호출과 명령의 실행 메서드 호출을 호출자(대체 함수) 안으로 인라인한다.
6. 테스트한다.
7. 죽은 코드 제거하기로 명령 클래스를 없앤다.

### 11.11 수정된 값 반환하기

```jsx
let totalAscent = 0;
cacluateAscent();

function caculateAscent() {
  for (let i = 1; i < points.length; i++) {
    const verticalChange = points[i].elevation - points[i - 1].elevation;
    totalAscent += verticalChange > 0 ? verticalChange : 0;
  }
}

const totalAscent = caculateAscent();

function caculateAscent() {
  let result = 0;
  for (let i = 1; i < points.length; i++) {
    const verticalChange = points[i].elevation - points[i - 1].elevation;
    result += verticalChange > 0 ? verticalChange : 0;
  }
  return result;
}
```

**데이터가 어떻게 수정되는지를 추적하는 일은 코드에서 이해하기 가장 어려운 부분중 하나다.**

- 데이터가 수정된다면 그 사실을 명확히 알려주어서, 어느 함수가 무슨 일을 하는지 쉽게 알 수 있게 하는 일이 대단히 중요하다.

**절차**

1. 함수가 수정된 값을 반환하게 하여 호출자가 그 값을 자신의 변수에 저장하게 한다.
2. 테스트한다.
3. 피호출 함수 안에는 반환할 값을 가리키는 새로운 변수를 선언한다.
4. 테스트한다.
5. 계산이 선언과 동시에 이뤄지도록 통합한다. (즉 선언 시점에 계산 로직을 바로 실행해 대입한다)
6. 테스트한다.
7. 피호출 함수의 변수 이름을 새 역할에 어우릴도록 바꿔준다.
8. 테스트한다.

### 11.12 오류 코드를 예외 바꾸기

```jsx
if (data) return new ShippingRules(data);
else return -23;

if (data) return new ShippingRules(data);
else throw new OrderProcessingError(-23);
```

**예외는 프로그래밍 언어에서 제공하는 독립적인 오류 처리 메커니즘이다.**

- 예외를 사용하면 오류코드를 일일이 검사하거나 오류를 식별해 콜스택 위로 던지는 일을 신경쓰지 않아도 된다.
- 다른 정교한 메커니즘과 같이 정확하게 사용할 때만 최고 효과를 낸다.
- 예외는 정확히 예상 밖의 동작일 때만 쓰여야 한다.

**절차**

1. 콜스택 상위에 해당하는 예외를 처리할 예외 핸들러를 작성한다.
2. 테스트한다.
3. 해당 오류 코드를 대체할 예외와 그 밖의 예외를 구분할 식별 방법을 찾는다.
4. 정적 검사를 수행한다.
5. catch 절을 수정하여 직접 처리할 수 있는 예외는 적절히 대처하고 그렇지 않은 예외는 다시 던진다.
6. 테스트한다.
7. 오류 코드를 반환하는 곳 모두에서 예외를 던지도록 수정한다. 하나씩 수정할때마다 테스트한다
8. 모두 수정했다면 그 오류 코드를 콜스택 위로 전달하는 코드를 모두 제거한다. 하나씩 수정할때마다 테스트한다.

### 11.13 예외를 사전확인으로 바꾸기

```jsx
double getValueForPeriod(int periodNumber) {
	try {
		return values[periodNumber]
	} catch (ArrayIndexOutOfBountException e) {
		return 0;
	}
}

double getValueForPeriod(int periodNumber) {
	return (periodNumber >= values.length) ? 0: values[periodNumber]
}
```

**예외라는 개념은 프로그래밍 언어의 발전에 의미 있는 한걸음 이었다. 오류 코드를 연쇄적으로 전파하던 긴 코드를 예외로 바꿔 제거할 수 있게 되었기 때문이다.**

- 예외는 '뜻밖의 오류'라는, 말 그대로 예외적으로 동작할 때만 쓰여야한다.
- 호출 전에 검사 할 수 있다면, 예외를 던지는 대신 호출하는 곳에서 조건을 검사하도록 해야한다.

**절차**

1. 예외를 유발하는 상황을 검사할 수 있는 조건문을 추가한다. catch 블록의 코드를 조건문의 조건절 중 하나로 옮기고, 남은 try 블록의 코드를 다른 조건절로 옮긴다.
2. catch 블록에 어서션을 추가하고 테스트한다.
3. try문과 catch 블록을 제거한다.
4. 테스트한다.
