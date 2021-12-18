import { renderHook, act } from "@testing-library/react-hooks";
import {
  useStaticEncapsulation,
  useVariableEncapsulation,
} from "./useEncapuslation.hook";

const mock_static_data = {
  name: "애크미 구스베리",
  country: "GB",
};

describe("use Static Hook Test", () => {
  const { result } = renderHook(() =>
    useStaticEncapsulation({ data: mock_static_data })
  );

  it("get name test", () => {
    const { current } = result;
    expect(current.getName()).toBe("애크미 구스베리");
  });

  it("get country test", () => {
    const { current } = result;
    expect(current.getCountry()).toBe("GB");
  });
});

/**
 * 간단한 레코드 캡슐화하기
 */

describe("simple encasulation", () => {
  it("set and get name test", () => {
    const { result } = renderHook(() =>
      useStaticEncapsulation({ data: mock_static_data })
    );
    act(() => {
      result.current.setName("손덕현");
    });
    expect(result.current.getName()).toBe("손덕현");
  });

  it("set and get country test", () => {
    const { result } = renderHook(() =>
      useStaticEncapsulation({ data: mock_static_data })
    );

    act(() => {
      result.current.setCountry("한국");
    });
    expect(result.current.getCountry()).toBe("한국");
  });
});

/**
 * 가변 컬렉션 캡슐화
 */

describe("use Variable Hook Test", () => {
  it("get courses test", () => {
    const { result } = renderHook(() => useVariableEncapsulation());
    expect(result.current.getCourses()).toEqual([]);
  });

  it("add and get courses test", () => {
    const { result } = renderHook(() => useVariableEncapsulation());

    act(() => {
      result.current.addCourse("doug");
    });
    expect(result.current.getCourses()).toEqual(["doug"]);
  });

  it("remove and get courses test", () => {
    const { result } = renderHook(() => useVariableEncapsulation());

    act(() => {
      result.current.addCourse("doug");
    });
    expect(result.current.getCourses()).toEqual(["doug"]);

    act(() => {
      result.current.revmoeCourse("doug");
    });
    expect(result.current.getCourses()).toEqual([]);
  });
});
