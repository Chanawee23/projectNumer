import React from "react";
import "./index.css";
import { evaluate, parse } from "mathjs";
import api from "../../../api"; 
const { create, all } = require("mathjs");
const mathjs = create(all);
mathjs.import(require("mathjs-simple-integral"));

export class CompositeTrapezoidal extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      data: "",
      a: "",
      b: "",
      n: "",
      ans: "",
      error: ""
    };

    this.CT = this.CT.bind(this);
    this.a = this.a.bind(this);
    this.b = this.b.bind(this);
    this.n = this.n.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = async () => {
    await api.getMovieById("5e7b7075f4fd150019024be2").then(db => {
      this.setState({
        data: db.data.data.fx
      });
      this.setState({
        a: db.data.data.XL
      });
      this.setState({
        b: db.data.data.XR
      });
      this.setState({
        n: db.data.data.N
      });
      

    });
  };

  handleChange({ target: { value } }) {
    this.setState({ data: value });
  }

  a({ target: { value } }) {
    this.setState({ a: value });
  }

  b({ target: { value } }) {
    this.setState({ b: value });
  }

  n({ target: { value } }) {
    this.setState({ n: value });
  }

  CT = e => {
    var cal;

    var fx = this.state.data;
    var a = parseFloat(this.state.a);
    var b = parseFloat(this.state.b);
    var n = parseFloat(this.state.n);

    var fxig = mathjs.integral(fx, "x").toString();
    var i = evaluate(fxig, { x: b }) - evaluate(fxig, { x: a });
    var x = i;

    console.log("fx:", fx);
    console.log("fxig:", fxig);
    console.log("i:", i);
    console.log("a:", a);
    console.log("b:", b);
    console.log("n:", n);

    cal = evaluate(fx, { x: a });
    var fa = parseFloat(cal);
    console.log("fa:", fa);

    cal = evaluate(fx, { x: b });
    var fb = parseFloat(cal);
    console.log("fb:", fb);

    var h = (b - a) / n;
    console.log("h:", h);
    var i = 0,
      sum = 0,
      xg = a+h;

    while (xg < b) {
      cal = evaluate(fx, { x: xg });
      var fg = parseFloat(cal);
      console.log("Efxi:", fg);
      sum = sum + fg;
      console.log("sum :", sum);
      xg = xg + h;
    }

    var ans = (h / 2) * (fa + 2 * sum + fb);
    ans = ans.toFixed(6);
    this.setState({ ans: ans });

    var eror = Math.abs((x - ans) / x);

    eror = eror.toFixed(6);

    this.setState({ eror: eror });
    e.preventDefault();
  };

  render() {
    var i = 0;
    var eror = this.state.eror;
    var ans = this.state.ans;

    return (
        <div className="App">

        <div className="App-CompositeTrapezoidal">
    
          <div>
            <form action="">
              <p> </p>
              <legend>Composite Trapezoidal's Rule </legend>

              <div>
                <label for="">fx </label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />
              </div>

              <div>
              <label for="">  a </label>
                <input
                  onChange={this.a} //ไปเรียกมาทำ
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />
              
                <label for="">  b </label>
                <input
                  onChange={this.b}
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />

                <label for="">  n </label>
                <input
                  onChange={this.n}
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />
              </div>
              <p></p>
              
              <button type="submit" onClick={this.CT}>
                Submit
              </button>

              <button type="submit" onClick={this.CT}>
                API
              </button>

              <div
                style={{
                  width: "100%",
                  height: "1500px"
                }}
              >
                <div className = "App-background3">
                <table style={{ width: "100%", border: "solid Orange" }}>
                  <tr style={{ color: "#e3fe42" }}>
                    <th style={{ border: "solid Orange" }}>I</th>
                    <th style={{ border: "solid Orange" }}>Error</th>
                  </tr>
                  <tr>
                    <td style={{ border: "solid Orange" }}>
                      <div>{ans}</div>
                    </td>
                    <td style={{ border: "solid Orange" }}>
                      <div>{eror}</div>
                    </td>
                  </tr>
                </table>
              </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

