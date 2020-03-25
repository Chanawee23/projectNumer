import 'antd/dist/antd.css';
import './index.css'; 
import React, { Component } from 'react'; 
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import { evaluate } from 'mathjs'
import api from "../../../api"; 
const PlotlyComponent = createPlotlyComponent(Plotly);
const _ = String.raw;



export class OnepoinForm extends Component {

    
  constructor(props) {
    super(props);

    this.state = { //setค่าเริ่มต้นของแต่ละตัวแปรให้เป็นค่าว่าง ตัวแปรชนิดนึงที่เรียกว่า state
      value: "",
      data: "",
      x: [],
      error: [],
      fx: [],
    };

    this.OP = this.OP.bind(this);   //การประกาศหรือเรียกฟังชั่น
    this.x = this.x.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.plot = this.plot.bind(this);
  }

  componentDidMount = async () => { //ฟังก์ชั่นเริ่มต้นมีมาให้ ตั้งค่าเริ่มต้นให้ดาต้าเบส
    await api.getMovieById("5e7a2cbcb91d4b001919966d").then(db => {
      this.setState({
        data: db.data.data.fx
      });
      console.log(db.data)
      this.state.x[0] = parseFloat(db.data.data.XL);
      //this.state.xr[0] = parseFloat(db.data.data.XR);
    });
  };

  handleChange({ target: { value } }) {  //รับสมการfx
    this.setState({ value, data: value });      //ฟังก์ชันที่สร้างขึ้นมาเพื่อเปลี่ยนค่าใน state
    
  }

  x({ target: { value } }) { 
    
    this.state.x[0] = parseFloat(value); //เอาสตริงมาใช้ แปลงสตริงเป็นfloat
  }
  
  OP = e => { //ฟังชันคำนวณ
    e.preventDefault(); //เป็นคำสั่งไม่ให้รีตลอดเวลา
    var value = this.state.data; 
    var x = parseFloat(this.state.x);
    var x_old = 0, error = 0, fxi = 0;
        var i, j = 0, fx = '',cal

      do {
        let scp = {
          x: x
        };
        
        cal = evaluate(value, scp);
        fx = "";
        fxi = 0;
        fxi = parseFloat(cal);
        this.state.fx[j] = fxi;
        console.log(fxi);
        cal = 0;
        x_old = x;
        console.log("x_old = ", x_old);
        x = fxi;
        console.log("x = ", x);

        error = Math.abs((x - x_old) / x)
        this.state.error[j] = error;
        console.log("error = ", error);
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
    const y_plot = this.state.fx;

    var data = [
      {
        type: "scatter",
        x: x_plot,
        y: y_plot,
        marker: {
          color: "#ff6d00"
        }
      },
      
    ];

    return data;
  }

  render() {
    var i = 0;
    let data = this.plot();
    var x = this.state.x;
    var fx = this.state.fx;
    var error = this.state.error;
    return (
      <div className="App">

        <div className="App-Onepoint">
    
          <div>
            <form action="">
              <p> </p>
              <legend>ONEPOINT</legend>
              <div>
                <label for="">  fx </label>
                <input
                  onChange={this.handleChange} //ไปเรียกมาทำ
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />
              
                <label for="">  X </label>
                <input
                  onChange={this.x}
                  type="text"
                  class="form-control"
                  id=""
                  placeholder="Input field"
                />

              </div>
              <p></p>
              
              <button type="submit" onClick={this.OP}>
                SUBMIT
              </button>
              <label for="">     </label> 
              <button type="submit" onClick={this.OP}>
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
                    <th style={{ border: "solid pink" }}>Xi</th>
                    <th style={{ border: "solid pink" }}>Xi+1</th>
                    <th style={{ border: "solid pink" }}>Error</th>
                  </tr>
                
                
                  <tr>
                    <td style={{ border: "solid pink" }}>
                      {x.map( //หยิบค่าในarray แต่ละตัว
                        x => (
                          <div>{++i}</div>
                        ),
                        this
                      )}
                    </td>
                    <td style={{ border: "solid pink" }}>
                      {x.map(x => (
                        <div>{x.toFixed(6)}</div>
                      ))}
                    </td>
                    <td style={{ border: "solid pink" }}>
                      {fx.map(  
                        fx => (
                          <div>{fx.toFixed(6)}</div>
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


