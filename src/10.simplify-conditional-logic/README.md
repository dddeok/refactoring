## 조건부 로직 간소화

> 조건부 로직은 프로그램의 힘을 강화하는데 큰 기여하지만, 안타깝게도 프로그램을 복잡하게 만드는 주요 원흉이기도 하다.

1. 조건문 분해하기.
2. 중복 조건식 통합하기
3. 중첩 조건물을 보호 구문으로 바꾸기
4. 조건부 로직을 다형성으로 바꾸기
5. 특이 케이스 추가하기 (널(Null) 객체 추가하기)
6. 어서션 추가하기
7. 제어 플래그를 탈출문으로 바꾸기

### 10.1 조건문 분해하기

```jsx
if (!aDate.isBefore(plan.sumerStart) && !aDate.isAfter(plan.summberEnd)) {
  charge = quantity * plan.sumerRate;
} else charge = quantity * plan.regularRate + plan.regularServiceCharge;

if (summer()) {
  charge = summerCharge();
} else charge = regularCharge();
```

무슨 일이 일어나는지는 이야기 해주지만, **왜 일어나는지는 제대로 말해주지 않을 때가 많다.**

- 코드를 부위별로 분해한 다음 해체된 코드 덩어리들을 각 덩어리의 의도를 살린 이름의 함수 호출로 바꿔주자.

**절차**

1. 조건식과 그 조건식에 딸린 조건절 각각을 함수로 추출한다.

### 10.2 조건식 통합하기

```jsx
if (anEmployee.seniority < 2) return 0;
if (anEmployee.monthsDisabled > 12) return 0;
if (anEmployee.isPartTime) return 0;

if (isNotEligibleForDisability()) return 0;

function isNotEligibleForDisability() {
  return (
    anEmployee.seniority < 2 ||
    anEmpolyee.monthDisabled > 12 ||
    anEmployee.isPartTime
  );
}
```

**비교하는 조건은 다르지만 그 결과로 수행하는 동작은 똑같은 코드들이 존재한다. 어차피 같은 일을 할거라면 조건 검사도 하나로 통합하는게 낫다.**

- 여러 조각으로 나뉜 조건들을 하나로 통합함으로써 내가 하려는 일이 명확해진다.
- 작업이 함수 추출하기까지 이어질 가능성이 높다.

**절차**

1. 해당 조건식들 모두에 부수효과가 없는지를 확인하다.
2. 조건문 두개를 선택하여 두 조건문의 조건식들을 논리 연산자로 결합한다.
3. 테스트한다.
4. 조건이 하나만 남을 때 까지 2~3 과정을 반복한다.
5. 하나로 합쳐진 조건식을 함수로 추출할지 고려해본다.

**복합된 상황에서는 AND와 OR 연산자를 적절히 섞어 결합하자.**

### 10.3 중첩 조건물을 보호 구문으로 바꾸기

```jsx
function getPayAmount() {
  let result;
  if (isDead) result = deadAmount();
  else {
    if (isSeparated) result = seperatedAmount();
    else {
      if (isRetired) result = retiredAmount();
      else {
        result = normalPayAmount();
      }
    }
  }
}

function getPayAmount() {
  if (isDead) return deadAmount();
  if (isSeparated) return separatedAmount();
  if (isRetired) return retiredAmount();
  return normalPayAmount();
}
```

**조건문은 주로 두가지 형태로 쓰인다. 참인 경로와 거짓인 경로 모두 정상 동작으로 이어지는 형태와, 한쪽만 정상인 형태다**

- 한쪽만 정상이라면 비정상 조건을 if에서 검사한 다음, 조건이 참이라면(비정상이면) 함수에서 빠져나온다.
- 두번째 검새형태를 흔히 보호구문이라고 한다.

**절차**

1. 교체해야 할 조건 중 가장 바깥 것을 선택하여 보호 구문으로 바꾼다.
2. 테스트한다.
3. 1~2 과정을 필요한 만큼 반복한다.
4. 모든 보호 구민이 같은 결과를 반환한다면 보호 구문들의 조건식을 통합 한다.

### 10.4 조건부 로적일 다형성으로 바꾸기

```jsx
switch (bird.type) {
	case '유럽 제비':
		return "보통이다";
	case '아프리카 제비':
		return (bird.numberOfCoCounts > 2) ? "지쳤다" : "보통이다";
	case '노르웨이 파랑 앵무':
		return (bird.voltage > 100) ? "그을렸다" : "예쁘다";
	default :
		return "알 수 없다"
}

class EuropeanSwallow {
	get plumage() {
		return "보통이다"
	}
}

class AfricanSwallow {
	get plumgae() {
		return (this.numberOfCocounts > 2) ? "지쳤다" : "보통이다";
	}
}
...
class NorwegianBlueParrot {
	get plumage() {
		return (this.voltage > 100) ? "그을렸다" : "예쁘다";
	}
}
```

**조건부 로직을 직관적으로 구조화할 방법을 항상 고민해야한다고는 하지만, 과연 위의 방식이 맞는지는 본인은 잘모르겠다.**

- 해당 코드의 직관성을 나타낼 수 는 있겠지만, 해당 뎁스가 늘어나고 과연 직관적이라 할 수 있을지 의문이다.
- 결국엔 해당 구조화를 사용하기 위해서도 조건부 로직이 빠질 수는 없기 때문이다.
- 책에서는 그 후 추가되는 로직에 대한 설명이 첨부되어 구조화에 대한 이유가 납득이 되긴하나, 책의 첫 설명에서 포함되는 내용은 그를 반증하지 못한다. 이것은 상황에 따라 너무나 다를 수 가 있다. 물론 책의 뒤의 예시들 처럼 구조화가 필요하다면 반복로직을 없애기 위해서라도 해당 노력을 진행해야한다.

**절차**

1. 다형적 동작을 표현하는 클래스 들이 아직 없다면 만들어준다. 이왕이면 적합한 인스턴스를 알아서 만들어 반환하는 팩터리 함수도 함께 만든다.
2. 호출하는 코드에서 팩터리 함수를 사용하게 한다.
3. 조건부 로직 함수를 슈퍼 클래스로 옮긴다.
4. 서브클래스 중 하나를 선택한다. 서브 클래스에서 슈퍼 클래스의 조건부 로직 메서드를 오버라이드 한다. 조건부 문장 중 선택된 서브클래스에서 해당하는 조건절을 서브클래스 메서드로 복사한 다음 적절히 수정한다.
5. 같은 방식으로 각 조건절을 해당 서브클래스에서 메서드로 구현한다.
6. 슈퍼클래스 메서드에는 기본 동작 부분만 남긴다. 혹은 슈퍼클래스가 추상 클래스여야 한다면, 이 메서드를 추상으로 선언하거나 서브클래스에서 처리해야 함을 알리는 에러를 던진다.

**슈퍼클래스의 로직은 간소화되고 이해하기 더 쉬워졌으며, 변형 동작은 슈퍼클래스와의 차이를 표현해야하는 서브클래스에서만 신경쓰면된다**

### 10.5 특이 케이스 추가하기

```jsx
if (aCustomer === "미확인 고객") customerName = "거주자";

class UnknownCustomer {
  get name() {
    return "거주자";
  }
}
```

**데이터 구조의 특정 값을 확인한 후 똑같은 동작을 수행하는 코드가 곳곳에 등장하는 경우가 더러있는데, 흔히 볼 수 있는 중복 코드 중 하나다.**

- 특수한 경우의 공통 동작을 요소 하나에 모아서 사용하는 특이 케이스 패턴(Special Case Pattern)
- 코드 대부분을 단순한 함수 호출로 바꿀 수 있다.

**절차**

1. 컨테이너에 특이 케이스인지를 검사하는 속석을 추가하고, fasle를 반환하게 한다.
2. 특이 케이스 객체를 만든다. 이 객체는 특이 케이스 인지를 검사하는 속성만을 표현하며, 이 속성은 true를 반환하게 한다.
3. 클라이언트에서 특이 케이스 인지를 검사하는 코드를 함수로 추출한다. 모든 클라이언트가 값을 직접 비교하는 대신 방금 추출한 함수를 사용하도록 고친다.
4. 코드에 새로운 특이 케이스 대상을 추가한다. 함수의 반환 값으로 받거나 변환 한수를 적용하면 된다.
5. 특이 케이스를 검사하는 함수 본문을 수정하여 특이케이스 객체의 속서을 사용하도록 한다.
6. 여러 함수를 클래스로 묶기나 여러 함수를 변환 함수로 묶기를 적용하여 특이 케이스를 처리하는 공통 동작을 새로운 요소로 옮긴다.
7. 아직도 특이 케이스 검사 함수를 이용하는 곳이 남아 있다면 검사 함수를 인라인 한다.
