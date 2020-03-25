import 'antd/dist/antd.css';
import './index.css';
import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import { evaluate, derivative } from 'mathjs'
import api from "../../../api";

const PlotlyComponent = createPlotlyComponent(Plotly);
const _ = String.raw;



export class NewtonForm extends Component {


  constructor(props) {
    super(props);

    this.state = {
      value: '',
      data: '',
      x: [],
      error: [],
      fx: [],
      fxd: []

    };

    this.NT = this.NT.bind(this);
    this.x = this.x.bind(this);
    this.plot = this.plot.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = async () => { //ฟังก์ชั่นเริ่มต้นมีมาให้ ตั้งค่าเริ่มต้นให้ดาต้าเบส
    await api.getMovieById("5e79040400ebce0012be1029").then(db => {
      this.setState({
        data: db.data.data.fx
      });
      console.log(db.data)
      this.state.x[0] = parseFloat(db.data.data.XL);
      // this.state.xr[0] = parseFloat(db.data.data.XR);
    });
  };

  handleChange({ target: { value } }) {  //รับสมการfx
    this.setState({ value, data: value });      //ฟังก์ชันที่สร้างขึ้นมาเพื่อเปลี่ยนค่าใน state

  }

  x({ target: { value } }) {
    this.state.x[0] = parseFloat(value);
    console.log(this.state.x);
  }
  state = {
    isOpen: false
  };

  NT = e => { //ฟังชันคำนวณ
    e.preventDefault(); //เป็นคำสั่งไม่ให้รีตลอดเวลา
    var value = this.state.data;
    var x = parseFloat(this.state.x);
    var x_old = 0, error = 0, xi = 0;
    var j = 0, fx = "", fxd = "";

    do {
      let scp = {
        x: x
      };
      console.log(value);
      fx = evaluate(value, scp);
      console.log("fx = ", fx);
      fxd = derivative(value, 'x').evaluate({ x: x });
      console.log("fxd = ", fxd);
      this.state.fx[j] = parseFloat(fx);
      this.state.fxd[j] = parseFloat(fxd);
      x_old = x;
      xi = x - (fx / fxd);
      error = Math.abs((xi - x_old) / xi);
      x = xi;
      this.state.error[j] = error;
      j++;
      if (j >= 15) {
        break;
      }
      if (error >= 0.00001) {
        this.state.x[j] = x;
      }

    } while (error >= 0.00001);
    this.setState({ data: "" });

    this.plot();
  };

  plot() {  //ของกราฟ
    const x_plot = this.state.x;
    const y_plot = this.state.fxx;
    console.log(x_plot, y_plot)
    var data = [

      {
        type: 'scatter',
        x: x_plot,
        y: y_plot,
        marker: {
          color: '#ff6d00'
        },
      },

    ];
    console.log(data);
    return data
  }

  render() {
    var i = 0;
    let data = this.plot();
    var fx = this.state.fx;
    var fxd = this.state.fxd;
    var error = this.state.error;
    var x = this.state.x;
    return (
      <div className="App">

        <div className="App-Newton">

          <div>
            <form action="">
              <p> </p>
              <legend>NEWTONRAPHSON</legend>
              <div>
                <label for=""> fx </label>
                <input
                  onChange={this.handleChange} //ไปเรียกมาทำ
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />

                <label for=""> X </label>
                <input
                  onChange={this.x}
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />
              </div>
              <p></p>

              <button type="submit" onClick={this.NT}>
                SUBMIT
              </button>
              <label for="">     </label>
              <button type="submit" onClick={this.NT}>
                API
              </button>

              <div
                style={{
                  width: "100%",
                  height: "1500px"
                }}
              >
                <div className="App-background3">
                  <table style={{ width: "100%", border: "solid orange" }}>
                    <tr style={{ color: "#d76200" }}>
                      <th style={{ border: "solid orange" }}>Iteration</th>
                      <th style={{ border: "solid orange" }}>XI</th>
                      <th style={{ border: "solid orange" }}>fx</th>
                      <th style={{ border: "solid orange" }}>f'x</th>
                      <th style={{ border: "solid orange" }}>ERROR</th>

                    </tr>


                    <tr>
                      <td style={{ border: "solid orange" }}>
                        {x.map(
                          x => (
                            <div>{++i}</div>
                          ),
                          this
                        )}
                      </td>
                      <td style={{ border: "solid orange" }}>
                        {x.map(
                          x => (
                            <div>{x.toFixed(6)}</div>
                          ),
                          this
                        )}
                      </td>
                      <td style={{ border: "solid orange" }}>
                        {fx.map(
                          fx => (
                            <div>{fx.toFixed(6)}</div>
                          ),
                          this
                        )}
                      </td>
                      <td style={{ border: "solid orange" }}>
                        {fxd.map(fxd => (
                          <div>{fxd.toFixed(6)}</div>
                        ), 
                        this
                        )}
                      </td>
                      <td style={{ border: "solid orange" }}>
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


