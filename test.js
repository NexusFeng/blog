const tree = [
  {
      "label":"节点1",
      "value":"值1",
      "level":1,
      "children":[
          {
              "label":"节点1-1",
              "value":"值1-1",
              "level":2,
              "children":[
                  {
                      "label":"节点1-1-1",
                      "value":"1-1-1",
                      "level":3
                  },
                  {
                      "label":"节点1-1-2",
                      "value":"1-1-2",
                      "level":3
                  }
              ]
          }
      ]
  },
  {
      "label":"节点2",
      "value":"值2",
      "level":1,
      "children":[
          {
              "label":"节点2-1",
              "value":"值2-1",
              "level":2,
              "children":[
                  {
                      "label":"节点2-1-1",
                      "value":"2-1-1",
                      "level":3
                  }
              ]
          }
      ]
  }
]

const getAllPath = (tree) => {
  const paths = [], stack = tree.map(n => ([n, []]));
  console.log(stack, 'ss')
  while (stack.length) {
      const t = stack.pop();
      console.log(t, 't')
      t[1].push(t[0]);
      console.log(t, 't1')
      if (!t[0].children) {
          paths.push([...t[1]]);
          t[1].pop();
          continue;
      }
      t[0].children.forEach(cn => stack.push([cn, t[1]]))
  }
  return paths.map(p => ({
      "oneId": p[0].value,
      "oneName": p[0].label,
      "twoId": p[1].value,
      "twoName": p[1].label,
      "treeId": p[2].value,
      "treeName": p[2].label
  }));
}
console.log(getAllPath(tree))