## 9. 데이터 조직화

> 데이터 구조에서 하나의 값이 여러목적으로 사용된다면 혼란과 버그를 발생한다.

1. 변수 쪼개기
2. 변수 이름 바꾸기
3. 파생 변수를 질의 함수로 바꾸기
4. 참조를 값으로 바꾸기
5. 값을 참조로 바꾸기
6. 매직 리터럴 바꾸기

### 9.1 변수 쪼개기

```jsx
let temp = 2 * (height + width);
console.log(temp);
temp = height * width;
console.log = temp;

const perimeter = 2 * (height + width);
console.log(perimeter);
const area = height * width;
console.log(area);
```

**변수에 값을 여러번 대입 할 수 밖에 없는 경우가 존재한다. 하지만 이런 변수들에는 값을 단 한번만 대입하는 것이 좋은데 대입이 두번이상 이뤄진다면 여러가지 역할을 수행한다는 신호이다.**

**절차**

1. 변수를 선언한 곳과 값을 처음 대입하는 곳에서 변수 이름을 바꾼다.
2. 가능하면 이때 불변(immutable)으로 선언한다.
3. 이 변수에 두 번째로 값을 대입하는 곳 앞까지의 모든 참조를 새로운 변수이름으로 바꾼다.
4. 두 번째 대입 시 변수를 원래 이름으로 다시 선언한다.
5. 테스트 한다

### 9.2 필드 이름 바꾸기

```jsx
class Organization {
	get name() {...}
}

class Organization {
	get title() {...}
}
```

- **데이터 구조는 프로그램을 이해하는데 큰 역할을 한다.**
- **데이터 구조는 무슨일이 벌어지는지를 이해하는 열쇠다.**

**절차**

1. 레코드의 유효 범위가 제한적이라면 필드에 접근하는 모든 코드를 수정한 후 테스트 한다.
2. 레코드가 캡슐화되지 않았다면 우선 레코드를 캡슐화 한다.
3. 캡슐화된 객체 안의 private 필드명을 변경하고, 그에 맞게 내부 메서드들을 수정한다.
4. 테스트한다.
5. 생성자의 매개변수 중 필드와 이름이 겹치는게 있다면 함수 선언 바꾸기로 변경한다.
6. 접근자들의 이름도 바꿔준다.

**단, 리팩터링 도중 테스트에 실패한다면 더 작은 단계로 나눠 진행해야 한다는 신호임을 잊지 말자.**

### 9.3 파생 변수를 질의 함수로 바꾸기

```jsx
get discountedTotal() { return this._discountedTotal; }
set discount(aNumber) {
	const old = this._discount;
	this._discount = aNumber;
	this._discountedTotal += old - aNumber;
}

get discountedTotal() { return this._baseTotal - this._discount; }
set discount(aNumber) { this._discount = aNumber; }
```

**가변 데이터는 소프트웨어에 문제를 일으키는 가장 큰 골칫거리에 속한다. 그러므로, 가변 데이터의 유효 범위를 가능한 한 좁혀야 한다.**

**절차**

1. 변수 값이 갱신되는 지점을 모두 찾는다. 필요하면 변수 쪼개기를 활용해 각 갱신 지점에서 변수를 분리한다.
2. 해당 변수의 값을 계산해주는 함수를 만든다.
3. 해당 변수가 사용되는 모든 곳에 aserrt을 추가하여 함수의 계산 결과가 변수의 값과 같은지 확인한다.
4. 테스트한다.
5. 변수를 읽는 코드를 모두 함수 호출로 대체한다.
6. 테스트한다.
7. 변수를 선언하고 갱신하는 코드를 죽은 코드 제거하기로 없앤다.

### 9.4 참조를 값으로 바꾸기

```jsx
class Product {
  applyDiscount(arg) {
    this._price.amount = arg;
  }
}

class Product {
  applyDiscount(arg) {
    this._price = new Money(this._price.amount - arg, this._price.currency);
  }
}
```

**객체(데이터 구조)를 다른 객체(데이터 구조)에 중첩하면 내부 객체를 참조 혹은 값으로 취급할 수 있다.**

- 일반적으로 불변 데이터 구조는 다루기가 더쉽다.
- 값 객체는 분산 시스템과 동시성 시스템에서 특히 유용하다.

**절차**

1. 후보 클래스가 불변인지, 혹은 불변이 될 수 있는지를 확인한다.
2. 각각의 세터를 하나씩 제거한다.
3. 이 값 객체의 필드들을 사용하는 동치성(equality) 비교 메서드를 만든다.

### 9.5 값을 참조로 바꾸기

```jsx
let customer = new Customer(customerData);

let customer = customerRepository.get(customerData.id);
```

**하나의 데이터 구조안에 논리적으로 똑같은 제 3의 데이터 구조를 참조하는 레코드가 여러개 있을 때가 있다.**

- 고객 데이터를 갱신할 일이 없다면 방식은 중요하지 않다.
- 데이터를 물리적으로 복제해 사용할 때 가장 큰 문제가 되는 상황은 그 데이터를 갱신해야 할 때다.
- 클라이언트들의 접근을 관리해주는 일종의 저장소가 필요해진다.

**절차**

1. 같은 부류에 속하는 객체들을 보관할 저장소를 만든다.
2. 생성자에서 이 부류의 객체들 중 특정 객체를 정확히 찾아내는 방법이 있는지 확인한다.
3. 호스트 객체의 생성자들을 수정하여 필요한 객체를 이 저장소에서 찾도록하낟. 하나 수정할 때 마다 테스트한다.

### 9.6 매직 리터럴 바꾸기

```jsx
function potentialEnergy(mass, height) {
  return mass * 9.81 * height;
}

const STANDARD_GRAVITY = 9.81;
function potentialEnergy(mass, height) {
  return mass * STANDARD_GRAVITY * height;
}
```

**매직 리터럴이란 소스코드에 등장하는 일반적인 리터럴 값을 말한다.**

- 코드를 읽는 사람이 이 값의 의미를 모른다면 숫자 자체로는 의미를 명확히 알려주지 못하므로 매직 리터럴이라 할 수 있다.
