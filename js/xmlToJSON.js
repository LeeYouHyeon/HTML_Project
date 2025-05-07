// xml 을 JSON 으로 변환
function xmlToJson(xml) {
  // node 타입별 처리
  let obj = {};

  // ELEMENT_NODE
  if (xml.nodeType === 1) { 
    // 속성 처리
    if (xml.attributes.length > 0) {
      // obj라는 JS 객체 안에 @attributes라는 키를 만들고 
      // XML 요소의 속성 (Attribute) 목록을 담는 용도로 @attributes 사용 
      obj["@attributes"] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // TEXT_NODE
    obj = xml.nodeValue.trim();
  }

  // 자식 노드가 있으면 재귀
  if (xml.hasChildNodes()) {
    for(let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      const childJson = xmlToJson(item);
      // 공백 텍스트 노드 건너뛰기
      if (childJson === "") continue;  

      if (obj[nodeName] === undefined) {
        obj[nodeName] = childJson;
      } else {
        // 이미 같은 이름의 노드가 있으면 배열로 변환
        if (!Array.isArray(obj[nodeName])) {
          obj[nodeName] = [obj[nodeName]];
        }
        obj[nodeName].push(childJson);
      }
    }
  }
  return obj;
}