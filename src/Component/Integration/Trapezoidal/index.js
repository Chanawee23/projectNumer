import React from "react";
import "./index.css";
import { evaluate} from "mathjs";
import api from "../../../api"; 
const { create, all } = require("mathjs");
const mathjs = create(all);
mathjs.import(require("mathjs-simple-integral"));

export class Trapezoidal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            equa: '',
            fx: '',
            a: '',
            b: '',
            error: '',
            fxx: [],
            tt:'',
            i:'',

        };
        this.handleChange = this.handleChange.bind(this);
        this.SS = this.SS.bind(this);
        this.a = this.a.bind(this);
        this.b = this.b.bind(this);

    }

    handleChange({ target: { value } }) {
        this.setState({ fx: value });
    }
    a({ target: { value } }) {
        this.setState({ a: value});
        console.log(this.state.a);
    }
    b({ target: { value } }) {
        this.setState({ b: value});
        console.log(this.state.b);
    }

    componentDidMount = async () => {
        await api.getMovieById("5e7b6e4ad074050019f95adb").then(db => {
          this.setState({
            fx: db.data.data.fx
          });
          this.setState({
            a: db.data.data.XL
          });
          this.setState({
            b: db.data.data.XR
          });
          
        })
        console.log("fx",this.state.fx);
        console.log("a",this.state.a);
        console.log("b",this.state.b);
        
    }

    SS = e => {
        e.preventDefault();
        this.state.showtable=true;
        var fx = this.state.fx;
        var a = parseFloat(this.state.a);
        var b = parseFloat(this.state.b);
        console.log(a,b);
        var error = 0;
        console.log("debug fx ",fx)
        var fxx = mathjs.integral(fx,'x').toString();
        console.log("fxx:",fxx);
        var t = evaluate(fxx,{x:b})-evaluate(fxx,{x:a});
        console.log("true:",t);
        var tt = parseFloat(t);
        this.state.tt=tt;
        var h=(b-a)/2;
        var ha=h+a;
        var fa=parseFloat(evaluate(fx,{x:a}));
        console.log("fa:",fa);
        var fb=parseFloat(evaluate(fx,{x:b}));
        console.log("fb:",fb);
        var fha=parseFloat(evaluate(fx,{x:ha}))
        console.log("fha:",fha);
        var i = (h/3)*(fa+(4*fha)+fb);
        console.log("I:",i);
        error=(tt-i)/tt;
        console.log("error:",error);
        this.state.error=error.toFixed(6);
        this.state.i=i.toFixed(6);
        this.setState({ data: "" });
    
    };


    render() {
        var i= this.state.i;
        var ans = this.state.ans;
        var error = this.state.error;
        var showfx = this.state.fx;
        return (
        
            <div className="App">

            <div className="App-Trapezoidal">
        
              <div>
                <form action="">
                  <p> </p>
                  <legend>Trapezoidal </legend>
    
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

                  </div>
                  <p></p>
                  
                  <button type="submit" onClick={this.SS}>
                    Submit
                  </button>
    
                  <button type="submit" onClick={this.SS}>
                    API
                  </button>
    
                  <div
                    style={{
                      width: "100%",
                      height: "1500px"
                    }}
                  >
                    <div className = "App-background2">
                    <table style={{ width: "100%", border: "solid lightblue" }}>
                      <tr style={{ color: "#1569ed" }}>
                        <th style={{ border: "solid lightblue" }}>I</th>
                        <th style={{ border: "solid lightblue" }}>Error</th>
                      </tr>
                      <tr>
                        <td style={{ border: "solid lightblue" }}>
                          <div>{i}</div>
                        </td>
                        <td style={{ border: "solid lightblue" }}>
                          <div>{error}</div>
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
    
    