## 12. 상속 다루기

> > 객체 지향 프로그래밍에서 가장 유명한 특성인 상속(Inheritance)을 다룬다.
> > 다른 강력한 메커니즘 처럼 이 역시 아주 유용한 동시에 오용하기 쉽다.

1. 메서드 올리기
2. 필드 올리기
3. 생성자 본문 올리기
4. 메서드 내리기
5. 필드 내리기
6. 슈퍼클래스 추출하기
7. 서브클래스 제거하기
8. 계층 합치기
9. 타입 코드를 서브클래스로 바꾸기
10. 서브클래스를 위임으로 바꾸기
11. 슈퍼클래스를 위임으로 바꾸기

### 12.1 메서드 올리기

```jsx
class Employee { ... }

class Saleperson extends Employee {
	get name() { ... }
}

class Engineer extends Employee {
	get name() { ... }
}

class Emplyee {
	get name() { ... }
}

class Saleperson extends Employee { ... }
class Engineer extends Employee { ... }
```

**중복 코드 제거는 중요하다. 중복된 두 메서드가 당장은 문제 없이 동작할지라도 미래에는 벌레가 꼬이는 음식물 쓰레기로 전락할 수 있다.**

**절차**

1. 똑같이 동작하는 메서드인지 면밀히 살펴본다
2. 메서드 안에서 호출하는 다른 메서드와 참조하는 필드들을 슈퍼클래스에서도 호출하고 참조할 수 있는지 확인한다.
3. 메서드 시그니처가 다르다면 함수 선언 바꾸기로 슈퍼클래스에서 사용하고 싶은 형태로 통일한다.
4. 슈퍼클래스에 새로운 메서드를 생성하고, 대상 메서드의 코드를 복사해 넣는다.
5. 정적 검사를 수행한다.
6. 서브클래스 중 하나의 메서드를 제거한다.
7. 테스트한다.
8. 모든 서브클래스의 메서드가 없어질 때 까지 다른 서브클래스의 메서드를 하나씩 제거한다.

### 12.2 필드 올리기

```jsx
class Employee { ... }

class Saleperson extends Employee {
	private String name;
}

class Engineer extends Employee {
	private String name;
}

class Emplyee {
	protected String name;
}

class Saleperson extends Employee { ... }
class Engineer extends Employee { ... }
```

**서브클래스들이 독립적으로 개발되었거나, 뒤늦게 하나의 계층구조로 리팩터링된 경우라면 일부 기능이 중복되어 있을 때가 자주 있다.**

- 특히 필드가 중복되기 쉽다.
- 필드들이 비슷한 방식으로 쓰인다고 판단되면 슈퍼클래스로 끌어올리자.
- 데이터 중복선언을 제거할 수 있다.
- 해당 필드를 사용하는 동작을 서브클래스에서 슈퍼클래스로 옮길 수 있다.

**절차**

1. 후보 필드들을 사용하는 곳 모두가 그 필드들을 똑같은 방식으로 사용하는지 면밀히 살핀다.
2. 필드들의 이름이 각기 다르다면 똑같은 이름으로 바꾼다.
3. 슈퍼클래스에 새로운 필드를 생성한다.
4. 서브클래스의 필드들을 제거한다.
5. 테스트한다.

### 12.3 생성자 본문 올리기

```jsx
class Party {...}

class Employee extends Party {
	constructor(name, id, monthlyCost) {
		super();
		this._id = id;
		this._name = name;
		this._monthlyCost = monthlyCost;
	}
}

class Party {
	constructor(name) {
		this._name = name;
	}
}

class Employee extends Party {
	constructor(name, id, monthlyCost) {
		super(name);
		this._id = id;
		this._monthlyCost = monthlyCost
	}
}
```

**서브클래스들에서 기능이 같은 메서드들을 발견하면 함수 추출하기와 메서드 올리기를 차례로 적용하여, 말끔히 슈퍼클래스로 옮기곤한다.**

**절차**

1. 슈퍼클래스에 생성자가 없다면 하나 정의한다. 서브클래스의 생성자들에서 이 생성자가 호출되는지 확인한다.
2. 문장 슬라이드하기로 공통 문장 모두를 super() 호출 직후로 옮긴다.
3. 공통 코드를 슈퍼클래스에 추가하고 서브클래스들에서는 제거한다. 생성자 매개변수 중 공통 코드에서 참조하는 값들을 모두 super()로 건넨다.
4. 테스트한다.
5. 생성자 시작 부분으로 옮길 수 없는 공통 코드에는 함수 추출하기와 메서드 올리기를 차례로 적용한다.

### 12.4 메서드 내리기

```jsx
class Employee {
	get quota {...}
}

class Engineer extends Employee {...}
class Saleperson extends Employee {...}

class Employee {
	...
}

class Engineer extends Employee {...}
class Saleperson extends Employee {
	get quota {...}
}
```

**특정 서브클래스 하나 (혹은 소수)와만 관련된 메서드는 슈퍼클래스에서 제거하고 해당 서브클래스들에 추가하는 편이 깔끔하다.**

- 기능을 제공하는 서브클래스가 정확히 무엇인지를 호출자가 알고 있을때만 적용할 수 있다.

**절차**

1. 대상 메서드를 모든 서브클래스에 복사한다.
2. 슈퍼클래스에서 그 메서드를 제거한다.
3. 테스트한다.
4. 이 메서드를 사용하지 않는 모든 서브클래스에서 제거한다.
5. 테스트한다.

### 12.5 필드 내리기

```jsx
class Employee {
	private String quota;
}

class Engineer extends Employee {...}
class Saleperson extends Employee {...}

class Employee {...}

class Engineer extends Employee {...}
class Saleperson extends Employee {
	protected String quota;
}
```

**서브클래스 하나 (혹은 소수) 에서만 사용하는 필드는 해당 서브클래스 (들)로 옮긴다.**

**절차**

1. 대상 필드를 모든 서브클래스에 정의한다.
2. 슈퍼클래스에서 그 필드를 제거한다.
3. 테스트한다.
4. 이 필드를 사용하지 않는 모든 서브클래스에서 제거한다.
5. 테스트한다.

### 12.6 타입 코드를 서브클래스로 바꾸기

```jsx
function createEmployee(name, type) {
  return new Employee(name, type);
}

function createEmployee(name, type) {
  switch (type) {
    case "engineer":
      return new Engineer(name);
    case "salePerson":
      return new Saleperson(name);
    case "manage":
      return new Manager(name);
  }
}
```

**소프트웨어 시스템에서는 비슷한 대상들을 특정 특성에 따라 구분해야 할 때가 자주 있다.**

- 이런일을 다루는 수단으로는 타입 코드(type code) 필드가 있다.
- 조건에 따라 다르게 동작하도록 해주는 다형성을 제공한다.
- 타입코드에 따라 동작이 달라져야하는 함수가 여러개 일때 유용하다.
- 서브클래스 방식이 관계를 더 명확히 드러내준다.

**절차**

1. 타입 코드 필드를 자가 캡슐화한다.
2. 타입 코드 값 하나를 선택하여 그 값에 해당하는 서브클래스를 만든다. 타입 코드 게터 메서드를 오버라이드하여 해당 타입 코드의 리터럴 값을 반환하게 한다.
3. 매개변수로 받은 타입 코드와 방금 만든 서브클래스를 매핑하는 선택로직을 만든다.
4. 테스트한다.
5. 타입 코드 값 각각에 대해 서브클래스 생성과 선택 로직 추가를 반복하낟. 클래스 하나가 완성될 때마다 테스트한다.
6. 타입 코드 필드를 제거한다.
7. 테스트한다.
8. 타입 코드 접근자를 이용하는 메서드 모두에 메서드 내리기와 조건부 로직을 다형성으로 바꾸기를 적용한다.

### 12.7 서브클래스 제거하기

```jsx
class Person {
  get genderCode() {
    return "X";
  }
}

class Male extends Person {
  get genderCode() {
    return "M";
  }
}

class Female extends Person {
  get genderCode() {
    return "F";
  }
}

class Person {
  get genderCode() {
    return this._genderCode;
  }
}
```

**서브클래싱은 원래 데이터 구조와는 다른 변종을 만들거나 종류에 따라 동작이 달라지게 할 수 있는 유용한 매커니즘이다.**

- 하지만 목적성이 불명확하다면, 해당 코드는 제거하는 것이 효율적이다.

**절차**

1. 서브클래스의 생성자를 팩터리 함수로 바꾼다.
2. 서브클래스의 타입을 검사하는 코드가 있다면 그 검사코드에 함수 추출하기와 함수 옮기기를 차례로 적용하여 슈퍼클래스로 옮긴다. 하나 변경할 때마다 테스트한다.
3. 서브클래스의 타입을 나타내는 필드를 슈퍼클래스에 만든다.
4. 서브클래스를 참조하는 메서드가 방금 만든 타입 필드를 이용하도록 수정한다.
5. 서브클래스를 지운다.
6. 테스트한다.

### 12.8 슈퍼클래스 추출하기

```jsx
class Department {
	get totalAnnualCost() {...}
	get name() {...}
	get headCode() {...}
}

class Employee {
	get annualCost() {...}
	get name() {...}
	get id() {...}
}

class Party {
	get name() {...}
	get annualCost() {...}
}

class Department extends Party {
	get annualCost() {...}
	get headCount() {...}
}

class Employee extends Party {
	get annualCost() {...}
	get id() {...}
}
```

**객체 지향을 설명할 때 상속 구조는 현실 세계에서 활용하는 어떤 분류 체계에 기초하여 구현에 들어가기 앞서 부모 자식 관계를 신중하게 설계해야한다.**

**절차**

1. 빈 슈퍼클래스를 만든다. 원래의 클래스들이 새 클래스를 상속하도록한다.
2. 테스트한다.
3. 생성자 본문 올리기, 메서드 올리기, 필드 올리기를 차례로 적용하여 공통 원소를 슈퍼클래스로 옮긴다.
4. 서브클래스에 남은 메서드들을 검토한다. 공통되는 부분이 있다면 함수로 추출한 다음 메서드 올리기를 적용한다.
5. 원래 클래스들을 사용하는 코드를 검토하여 슈퍼클래스의 인터페이스를 사용하게 할지 고민해본다.

### 12.9 계층합치기

```jsx
class Employee {...}
class Saleperson extends Employee {...}

class Employee {...}
```

**클래스 계층구조를 리팩터링하다 보면 기능들을 위로 올리거나 아래로 내리는 일은 다반사로 벌어진다.**

- 독립적으로 존재해야 할 이유가 사라지는 경우도 생기기도 한다.

**절차**

1. 두 클래스 중 제거할 것을 고른다.
2. 필드 올리기와 메서드 올리기 혹은 필드 내리기와 메서드 내리기를 적용하여 모든 요소를 하나의 클래스로 옮긴다.
3. 제거할 클래스를 참조하던 모든 코드가 남겨질 클래스를 참조하도록 고친다.
4. 빈 클래스를 제거한다.
5. 테스트한다.

### 12.10 서브클래스를 위임으로 바꾸기

```jsx
class Order {
  get daysToShip() {
    return this._warehouse.daysToShip;
  }
}

class PriorityOrder extends Order {
  get daysToShip() {
    return this._priorityPlan.daysToShip;
  }
}

class Order {
  get daysToShip() {
    return this._priorityDelegate
      ? this.priorityDelegate.daysToShip
      : this._warehouse.daysToShip;
  }
}

class PriorityOrderDelegate {
  get daysToShip() {
    return this._priorityPlan.daysToship;
  }
}
```

**속한 갈래에 따라 동작이 달라지는 객체들은 상속으로 표현하는게 자연스럽다.**

- 가장 명확한 단점은 한번만 쓸 수 있는 카드라는 것이다.
- 클래스들의 관계를 아주 긴밀하게 결합한다.
- 위임은 이상의 두 문제를 모두 해결해주며, 다양한 클래스에 서로 다른 이유로 위임 할 수 있다.
- **(클래스) 상속보다는 (객체) 컴포지션을 사용하다.**

**절차**

1. 생성자를 호출하는 곳이 많다면 생성자를 팩터리 함수로 바꾼다.
2. 위임으로 활용할 빈 클래스를 만든다. 이 클래스의 생성자는 서브클래스에 특화된 데이터를 전부 받아야 하며, 보통은 슈퍼클래스를 가리키는 역참조도 필요하다.
3. 위임을 저장할 필드를 슈퍼클래스에 추가한다.
4. 서브클래스 생성 코드를 수정하여 위임 인스턴스를 생성하고 위임 필드에 대입해 초기화한다.
5. 서브클래스의 메서드 중 위임 클래스로 이동할 것을 고른다.
6. 함수 옮기기를 적용해 위임 클래스로 옮긴다. 원래 메서드에서 위임하는 코드는 지우지 않는다.
7. 서브클래스 외부에도 원래 메서드를 호출하는 코드가 있다면 서브클래스의 위임 코드를 슈퍼클래스로 옮긴다. 이때 위임이 존재하는지를 검사하는 보호 코드로 감싸야한다. 호출하는 외부 코드가 없다면 원래 메서드는 죽은 코드가 되므로 제거한다.
8. 테스트한다.
9. 서브클래스의 모든 메서드가 옮겨질 때까지 5~8 과정을 반복한다.
10. 서브클래스들의 생성자를 호출하는 코드를 찾아서 슈퍼클래스의 생성자를 사용하도록 수정한다.
11. 테스트한다.
12. 서브클래스를 삭제한다.

- **(클래스) 상속보다 (객체) 컴포지션을 사용하라보다는 컴포지션이나 상속 어느 하나만 고집하지 말고 적절히 혼용하라.**

### 12.11 슈퍼클래스를 위임으로 바꾸기

```jsx
class List {...}
class Stack extends List {...}

class Stack {
	constructor() {
		this._storage = new List();
	}
}

class List {...}
```

**객체 지향 프로그래밍에서 상속은 기존 기능을 재활용하는 강력하고 손쉬운 수단이다.**

- 상속이 혼란과 복잡도를 키우는 방식으로 이뤄지기도 한다.
- 혼란과 오류를 일으키는 예인 동시에 상속을 버리고 위임으로 갈아타 객체를 분리하면 쉽게 피할 수 있다.
- 슈퍼/서브클래스는 강하게 결합된 관계라서 슈퍼클래스를 수정하면 서브클래스가 망가지기 쉽기 때문이다.

**절차**

1. 슈퍼클래스 객체를 참조하는 필드를 서브클래스에 만든다. (이번 리팩터링을 끝마치면 슈퍼클래스가 위임 객체가 될 것 이므로 이 필드를 '위임 참조'라 부르자.) 위임 참조를 새로운 슈퍼클래스 인스턴스로 초기화 한다.
2. 슈퍼클래스의 동작 각각에 대응하는 전달 함수를 서브클래스에 만든다. (물론 위임 참조로 전달한다.) 서로 관련된 함수끼리 그룹으로 묶어 진행하며, 그룹을 하나씩 만들 때마다 테스트한다.
3. 슈퍼클래스의 동작 모두가 전달 함수로 오버라드이 되었다면 상속 관계를 끊는다.
