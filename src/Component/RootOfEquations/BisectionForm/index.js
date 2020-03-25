import 'antd/dist/antd.css';
import './index.css'; 
import React, { Component } from 'react'; 
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import { evaluate } from 'mathjs'
import api from "../../../api"; 
const PlotlyComponent = createPlotlyComponent(Plotly);
const _ = String.raw;



export class BisectionForm extends Component {

    
  constructor(props) {
    super(props);

    this.state = { //setค่าเริ่มต้นของแต่ละตัวแปรให้เป็นค่าว่าง ตัวแปรชนิดนึงที่เรียกว่า state
      a: "",
      data: "",
      value: "",
      xl: [],
      xr: [],
      xm: [],
      error: [],
      fxr: [],
      fxl: [],
      fxm: [],
      movie: ""
    };

    this.BS = this.BS.bind(this);   //การประกาศหรือเรียกฟังชั่น
    this.xl = this.xl.bind(this);
    this.xr = this.xr.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.plot = this.plot.bind(this);
  }

  componentDidMount = async () => { //ฟังก์ชั่นเริ่มต้นมีมาให้ ตั้งค่าเริ่มต้นให้ดาต้าเบส
    await api.getMovieById("5e736d3f65ee500012da139f").then(db => {
      this.setState({
        data: db.data.data.fx
      });
      console.log(db.data)
      this.state.xl[0] = parseFloat(db.data.data.XL);
      this.state.xr[0] = parseFloat(db.data.data.XR);
    });
  };

  handleChange({ target: { value } }) {  //รับสมการfx
    this.setState({ data: value });      //ฟังก์ชันที่สร้างขึ้นมาเพื่อเปลี่ยนค่าใน state
    
  }

  xl({ target: { value } }) { 
    
    this.state.xl[0] = parseFloat(value); //เอาสตริงมาใช้ แปลงสตริงเป็นfloat
  }
  xr({ target: { value } }) {
    this.state.xr[0] = parseFloat(value);
  }

  BS = e => { //ฟังชันคำนวณ
    e.preventDefault(); //เป็นคำสั่งไม่ให้รีตลอดเวลา
    var value = this.state.data; 
    var xl = parseFloat(this.state.xl);
    var xr = parseFloat(this.state.xr);
    var xm = 0,
      xm_old = 0,
      error = 0,
      fxl = 0,
      fxr = 0,
      fxm = 0;
    var i,
      j = 0,
      cal;

    if (value != "" && xl != "" && xr != "") { //ข้อมูลจะต้องไม่เป็นช่องว่าง
      do {
        let scp = {
          x: xl
        };
        
        cal = evaluate(value, scp);
        fxl = 0;
        fxl = parseFloat(cal);
        this.state.fxl[j] = fxl;
        console.log(fxl);
        cal = 0;

        let scp1 = {
          x: xr
        };
        cal = evaluate(value, scp1);
        fxr = 0;
        fxr = parseFloat(cal);
        this.state.fxr[j] = fxr;
        cal = 0;

        xm = (xr + xl) / 2;

        let scp2 = {
          x: xm
        };
        cal = evaluate(value, scp2);
        fxm = 0;
        fxm = parseFloat(cal);
        this.state.fxm[j] = fxm;
        cal = 0;

        this.state.xm[j] = xm;

        error = Math.abs((xm - xm_old) / xm);
        this.state.error[j] = error;

        xm_old = xm;
        
        j++; 

        if (error >= 0.00001) {
          if (fxm * fxr < 0) {
            this.state.xl[j] = xm;
            this.state.xr[j] = xr;
            xl = xm;
          } else if (fxm * fxr > 0) {
            this.state.xr[j] = xm;
            this.state.xl[j] = xl;
            xr = xm;
          }
        }

        console.log( //ความหมายเหมือนปริ้น
          "xl =",
          this.state.xl[j],
          "xm = ",
          this.state.xm[j - 1],
          "xr = ",
          this.state.xr[j]
        );
      } while (error >= 0.00001);
      this.setState({ data: "" });
    }
    this.plot();
  };

  plot() {  //ของกราฟ
    const xl_plot = this.state.xl;
    const yl_plot = this.state.fxl;
    const xr_plot = this.state.xr;
    const yr_plot = this.state.fxr;

    var data = [
      {
        type: "scatter",
        x: xl_plot,
        y: yl_plot,
        marker: {
          color: "#ff6d00"
        },
        name: "XL"
      },
      {
        type: "scatter",
        x: xr_plot,
        y: yr_plot,
        marker: {
          color: "#ffab00"
        },
        name: "XR"
      }
    ];

    return data;
  }

  render() {
    var i = 0;
    let data = this.plot();
    var xl = this.state.xl;
    var xr = this.state.xr;
    var xm = this.state.xm;
    var fxl = this.state.fxl;
    var fxr = this.state.fxr;
    var fxm = this.state.fxm;
    var error = this.state.error;
    return (
      <div className="App">

        <div className="App-Bisection">
    
          <div>
            <form action="">
              <p> </p>
              <legend>BISECTION</legend>
              <div>
                <label for="">  fx </label>
                <input
                  onChange={this.handleChange} //ไปเรียกมาทำ
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />
              
                <label for="">  XL </label>
                <input
                  onChange={this.xl}
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />

                <label for="">  XR </label>
                <input
                  onChange={this.xr}
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />
              </div>
              <p></p>
              
              <button type="submit" onClick={this.BS}>
                SUBMIT
              </button>
              <label for="">     </label> 
              <button type="submit" onClick={this.BS}>
                API
              </button> 
              
              <div
                style={{
                  width: "100%",
                  height: "1500px"
                }}
              >
                <div className = "App-background">
                <table style={{ width: "100%", border: "solid pink" }}>
                  <tr style={{ color: "#da0a60ea" }}>
                    <th style={{ border: "solid pink" }}>Iteration</th>
                    <th style={{ border: "solid pink" }}>XL</th>
                    <th style={{ border: "solid pink" }}>XR</th>
                    <th style={{ border: "solid pink" }}>XM</th>
                    <th style={{ border: "solid pink" }}>f(XL)</th>
                    <th style={{ border: "solid pink" }}>f(XR)</th>
                    <th style={{ border: "solid pink" }}>f(XM)</th>
                    <th style={{ border: "solid pink" }}>Error</th>
                  </tr>
                
                
                  <tr>
                    <td style={{ border: "solid pink" }}>
                      {xr.map( //หยิบค่าในarray แต่ละตัว
                        x => (
                          <div>{++i}</div>
                        ),
                        this
                      )}
                    </td>
                    <td style={{ border: "solid pink" }}>
                      {xl.map(xl => (
                        <div>{xl.toFixed(6)}</div>
                      ))}
                    </td>
                    <td style={{ border: "solid pink" }}>
                      {xr.map(
                        xr => (
                          <div>{xr.toFixed(6)}</div>
                        ),
                        this
                      )}
                    </td>
                    <td style={{ border: "solid pink" }}>
                      {xm.map(
                        xm => (
                          <div>{xm.toFixed(6)}</div>
                        ),
                        this
                      )}
                    </td>
                    <td style={{ border: "solid pink" }}>
                      {fxl.map(
                        fxl => (
                          <div>{fxl.toFixed(6)}</div>
                        ),
                        this
                      )}
                    </td>
                    <td style={{ border: "solid pink" }}>
                      {fxr.map(
                        fxr => (
                          <div>{fxr.toFixed(6)}</div>
                        ),
                        this
                      )}
                    </td>
                    <td style={{ border: "solid pink" }}>
                      {fxm.map(
                        fxm => (
                          <div>{fxm.toFixed(6)}</div>
                        ),
                        this
                      )}
                    </td>
                    <td style={{ border: "solid pink" }}>
                      {error.map(
                        er => (
                          <div>{er.toFixed(6)}</div>
                        ),
                        this
                      )}
                    </td>
                  </tr>
                </table>
                </div>
                <div
                  style={{ width: "100%", height: "550px", float: "middle" }}
                >
                  <PlotlyComponent className="whatever" data={data} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}


