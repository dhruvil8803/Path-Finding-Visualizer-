let s = "<table>";
let n = 20;
let m = 50;
let arr = new Array(20);
let visited = new Array(20);
let parents = new Array(20);
for (var i = 0; i < n; i++) {
    arr[i] = new Array(50);
    visited[i] = new Array(50);
    parents[i] = new Array(50);
    for(var j = 0; j < m; j++) {
        arr[i][j] = -1;
        visited[i][j] = false;
        parents[i][j] = -1;
    }
}
for(let i = 0; i < n; i++){
    s += "<tr>"
    for(let j = 0; j < m; j++){
     s += `<td id=${i*m + j} onclick="select(this.id)" onmouseover="obst(this.id)"></td>`
    }
    s += "</tr>"
}
s += "</table>"
document.getElementsByClassName("grid")[0].innerHTML = s;

let getRC = (num)=>{
    let temp = [];
    temp.push(parseInt(num / m));
    temp.push(num % m);
    return temp;
}

let startid = 0;
let endid = 1;
document.getElementById(startid).style.backgroundColor = "#D65DB1";
document.getElementById(endid).style.backgroundColor = `#FF9671`;
arr[0][0] = 0;
arr[0][1] = 1;
let sourceb = false;
let destinationb = false;
let obstacleb = false;
let toggle = false;
let source = (e)=>{
     sourceb = true;
     destinationb = false;
     obstacleb = false;
}
let destination = ()=>{
    sourceb = false;
    destinationb = true;
    obstacleb = false;
}
let obstacle = ()=>{
    sourceb = false;
    destinationb = false;
    obstacleb = true;
}
let obst = (e)=>{
    if(!obstacleb || !toggle) return;
    if(e === startid || e === endid) return;
    let z = getRC(e);
    if(arr[z[0]][z[1]] === 2){
        arr[z[0]][z[1]] = -1;
        document.getElementById(e).style.backgroundColor = "white";
        return;
    }
    arr[z[0]][z[1]] = 2;
  document.getElementById(e).style.backgroundColor = "black";
}

let select = (e)=>{
    if(sourceb){
        let z = getRC(e);
        if(arr[z[0]][z[1]] !== -1) return; 
        if(e !== startid) {
             z = getRC(startid);
            arr[z[0]][z[1]] = -1;
            document.getElementById(startid).style.backgroundColor = "white";
     }
     startid = e;
     document.getElementById(startid).style.backgroundColor = "#D65DB1";
      z = getRC(startid);
     arr[z[0]][z[1]] = 0;
     sourceb = false;
    }
    else if(destinationb){
        let z = getRC(e);
        if(arr[z[0]][z[1]] !== -1) return; 
        if(e !== endid) {
             z = getRC(endid);
            arr[z[0]][z[1]] = -1;
            document.getElementById(endid).style.backgroundColor = "white";
       }
     endid = e;
     document.getElementById(endid).style.backgroundColor = "#FF9671";
      z = getRC(endid);
     arr[z[0]][z[1]] = 1;
     destinationb = false;
    }
    else if(obstacleb){
        if(!toggle) toggle = true;
        else{
            toggle = false;
            obstacleb = false;
        } 
    }
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let dfs = async (i, j, x, y, d)=>{
      if(i < 0 || i >= n || j < 0 || j >= m) return false;
      if(visited[i][j]) return false;
      if(arr[i][j] === 2) return false;
      await sleep(30);
      let f = i * m + j;
      if(i === x && j === y) {
          return true;
        }
        visited[i][j] = true;
        if(!d){
        document.getElementById(f).style.backgroundColor = "#845EC2";
    }
        let comb = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for(let k = 0; k < 4; k++){
            let boolean = await dfs(i + comb[k][0], j + comb[k][1], x, y, false);
            if(boolean) {
                if(d) return; 
                document.getElementById(i * m +  j).style.backgroundColor = "#F9F871";
                await sleep(30);
                return true;
            }
        }
        return false;
        
    }
    let findPath = async (i, j , x, y)=>{
        while(true){
             let z = getRC(parents[x][y]);
            x = z[0];
            y = z[1];
            let f = x * m + y;
            if(x === i && y === j) break;
            document.getElementById(f).style.backgroundColor = "#F9F871";
            await sleep(20)
        }

    }
    let queue = [];
    let queueTop = 0;
    let bfs = async (i, j, x, y)=>{
     queue.push(i * m + j);
     while(queueTop < queue.length){
        await sleep(20);
        let node = queue[queueTop++];
        let z = getRC(node);
        if(visited[z[0]][z[1]]) continue;
        visited[z[0]][z[1]] = true;
        let f = z[0] * m + z[1];
        if(z[0] === x && z[1] === y) {
            await findPath(i, j, x, y);
            return true;
        }
        if(z[0] != i || z[1] != j)
        document.getElementById(f).style.backgroundColor = "#845EC2";
        let comb = [[0, 1], [-1, 0], [0, -1], [1, 0]];
        for(let k = 0; k < 4; k++){
            let u = z[0] + comb[k][0];
            let v = z[1] + comb[k][1];
            if(u < 0 || u >= n || v < 0 || v >= m) continue;
            if(visited[u][v]) continue;
            if(arr[u][v] === 2) continue;
            parents[u][v] = f; 
            queue.push(u * m + v);
        }
     }
     return false;
}
let start = async ()=>{
    let startz = getRC(startid);
    let endz = getRC(endid);
    let value = document.getElementById("select").value;
    if(value === "DFS") await dfs(startz[0], startz[1], endz[0], endz[1], true);
    else await bfs(startz[0], startz[1], endz[0], endz[1]);
}
let reset = ()=>{
    location.reload();
}