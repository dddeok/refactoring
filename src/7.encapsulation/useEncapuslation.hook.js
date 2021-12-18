import { useState } from "react";

export function useStaticEncapsulation({ data: initialData }) {
  const [data, setData] = useState(initialData);

  function getName() {
    return data.name;
  }

  function setName(name) {
    setData((prev) => ({ ...prev, name: name }));
  }

  function getCountry() {
    return data.country;
  }

  function setCountry(country) {
    setData((prev) => ({ ...prev, country: country }));
  }

  return {
    getName,
    setName,
    getCountry,
    setCountry,
  };
}

export function useVariableEncapsulation() {
  const [courses, setCourses] = useState([]);

  function getCourses() {
    return courses;
  }

  function addCourse(aCourse) {
    setCourses((prev) => [...prev, aCourse]);
  }

  function revmoeCourse(aCourse) {
    const aCourses = courses.filter((course) => course !== aCourse);
    setCourses(aCourses);
  }

  return {
    getCourses,
    addCourse,
    revmoeCourse,
  };
}
