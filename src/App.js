import React from 'react';
import 'antd/dist/antd.css' 
import './App.css'; 
import { Layout, Menu, Icon } from 'antd';
 
import {
  BisectionForm,
  FalseForm,
  SecantMethodForm,
  OnepoinForm,
  NewtonForm
} from "./Component/RootOfEquations"
import {HomePage} from "./Component/Content"

import { 
  CompositeSimpson,
  CompositeTrapezoidal,
  Simpson,
  Trapezoidal
  
} from "./Component/Integration";


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
 
 
class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: false,
        };
        this.setContent = this.setContent.bind(this);
        this.getContent = this.getContent.bind(this);
    }
    onCollapse = collapsed => {
        console.log(collapsed);
       this.setState({ collapsed });
     };
      getContent() {
          let {contentNumber} = this.state;
          if(contentNumber == null && !(contentNumber >=1 && contentNumber <=10))return(<div><HomePage/></div>)
          else {
              switch(contentNumber){
                case 1:
                   return (<div><HomePage/></div>);
                case 2:
                   return (<div><BisectionForm/></div>);
                case 3:
                    return (<div><FalseForm/></div>);
                case 4:
                    return (<div><NewtonForm/></div>);
                case 5:
                    return (<div><OnepoinForm/></div>);
                case 6:
                    return (<div><SecantMethodForm/></div>);  
                case 7:
                    return (<div><Trapezoidal/></div>);
                case 8:
                      return (<div><CompositeTrapezoidal/></div>);
                case 9:
                    return (<div><Simpson/></div>);
                case 10:
                    return (<div><CompositeSimpson/></div>);
                default:
                    return <div><HomePage  /></div>;
              }
          }
        }
     setContent(e) {
       console.log(e);
          if(e){
            this.setState ({contentNumber : parseInt(e.key),title : e.item.props.children});
          } 
         
      }
   
      render() {
        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
              <div className="App-logo" />
              <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" onClick = {this.setContent}>
                <Icon type="home" />  
                  <span>HOME</span>
               </Menu.Item>
               <SubMenu
                  key="sub1"
                  title={
                    <span>
                        <Icon type="cloud"/>  
                      <span>RootOfEquations</span>
                    </span>
                  }
                >
                <Menu.Item key="2" onClick = {this.setContent}>Bisection</Menu.Item>
                <Menu.Item key="3" onClick = {this.setContent}>FalsePosition</Menu.Item>
                <Menu.Item key="4" onClick = {this.setContent}>NewtonRaphson</Menu.Item>
                <Menu.Item key="5" onClick = {this.setContent}>One-point</Menu.Item>
                <Menu.Item key="6" onClick = {this.setContent}>Secant</Menu.Item>
               </SubMenu>
                <SubMenu
                 key="sub2"
                 title={
                    <span>
                     <Icon type="heart"/>  
                    <span>Integration</span>
                  </span>
                 }
                >
               <Menu.Item key="7" onClick = {this.setContent}>Trapezoidal</Menu.Item>
               <Menu.Item key="8" onClick = {this.setContent}>CompisiteTrapezoidal's Rule</Menu.Item>
               <Menu.Item key="9" onClick = {this.setContent}>Simpson's Rule</Menu.Item>
               <Menu.Item key="10"onClick = {this.setContent}>CompisiteSimpson's Rule</Menu.Item>
               </SubMenu>
              </Menu>
            </Sider>
           <Layout className="site-layout">
              <Header className="site-layout-background" style={{ padding: -10 }} />
             
              <Content style={{ margin: '0 0px' }}>
               
                <div className="site-layout-background" style={{ padding: 0, minHeight: 360 }}>
                  {this.getContent()}
                </div>
             </Content>
             <Footer style={{ textAlign: 'center' }}>Chanawee Sae-ung</Footer>
            </Layout>
         </Layout>
         
        );
     }
 }
export default App;