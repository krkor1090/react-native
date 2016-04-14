"use strict";
/**
 ==================================================================================
 Description:       desc
 Creation Date:     ${DATE}
 Author:            ${USER}  Poleski
 ==================================================================================
 
 ==================================================================================
 */
 */
 var React = require('react-native');
 var server_auth = require('./server_auth');
 var ForerunnerDB = require("forerunnerdb");
 var mobile_utils = require('./mobile_utils');
 var Collapsible = require('react-native-collapsible');
 var fdb = new ForerunnerDB(); 
 var db = fdb.db('xenforma');
 var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
	TouchableOpacity,
	ToolbarAndroid,
	ListView,Image,
	TouchableHighlight,
	 LayoutAnimation,
    } = React;
	

	var SideBarSection = React.createClass({
   
	getInitialState: function() {			
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});   
    var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});   
    var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});   
       
		return {		
		//dataSource: ds.cloneWithRows(this.props.mainmenu),
		dataSource: ds.cloneWithRows(this._genRows()),		
		 dataSource1: ds1.cloneWithRows({}),		 
		 dataSource2: ds2.cloneWithRows({}),		 
		};
	},
	_pressData: ({}: {[key: number]: boolean}),
    _genRows: function(pressData: {[key: number]: boolean}): Array<string> {		
		  var context = this;
		  var menu_items=[];		 
			var xenforma_menu_info = db.collection('xenforma_menu_info');	
			xenforma_menu_info.load(function (err) {
				if (!err) {
					var result=xenforma_menu_info.find({}); 				
					
					for (var i=0;i<result.length;i++) {						
						 menu_items.push(result[i].menuitem);						
						//var menuname=result[i].menuitem;
						//app_object[menuname]=
					}
					 context.setState({dataSource: context.state.dataSource.cloneWithRows( menu_items)});					 				
				}
			});
				  
	 return menu_items;
   },
	getsubdata_source:function(rowData){		
		var xenforma_submenu_first = db.collection('xenforma_submenu_first');
		var menu_items=[];
		var memu_item_map=[];		
		var context = this;	
		var result=[];
	    var app_object=[];
		xenforma_submenu_first.load(function (err) {			
			if (!err) {
				 result=xenforma_submenu_first.find({idd:rowData});						
                for(var i=0;i<result.length;i++){                    				
					 menu_items.push(result[i].submenu);
					 var submenu=result[i].submenu;
					 app_object[submenu]=result[i].app_obj;					
				 } 
					
					 context.setState({app_object:app_object});
					 context.setState({dataSource1: context.state.dataSource.cloneWithRows( menu_items)});					 				
			}
			if(err){				
				console.log(err);
			}
		});
		
		return result.length;
	}, 
	getsubdata_source_1:function(rowData){
		
		var xenforma_submenu_first = db.collection('xenforma_submenu_second');
		var menu_items=[];
		var memu_item_map=[];
		var context = this;	
		var result=[];
		xenforma_submenu_first.load(function (err) {
			if (!err) {
				result=xenforma_submenu_first.find({idd:rowData});						
                for(var i=0;i<result.length;i++){                    				
					 menu_items.push(result[i].submenu);					
				}  
                context.setState({child:result.length});				
				context.setState({dataSource2: context.state.dataSource.cloneWithRows( menu_items)});					 				
			}
		});
		
		return result.length;
	},   
	 render:function() { 
	   console.log("render-side -bar");
	    return(
		    <View style={{flex: 1, backgroundColor: '#fff'}}>
				   <ToolbarAndroid
				  logo={{uri: "http://webcreek.xenforma.com/images/logo.png"}}
				  title=""                
				   style={styles.toolbar}				 				   
				   /> 
				   <View style={styles.searchRow}>	
				   	   <Image
								style={{width:25,height:20,padding:1,right:2,top:3,}}
								source={require('./images/search.png')}
					   />					
					<TextInput
						  autoCapitalize="none"
						  autoCorrect={false}
						  clearButtonMode="always"						 
						  placeholder="Search..."
						  style={[styles.searchTextInput]}
						  testID="explorer_search"
					/>						
					</View>	
					
					<TouchableHighlight >
							<View style={{backgroundColor:'red'}} >
							  <View style={styles.row}>
								 <Image style={styles.thumb} source={THUMB_URLS[0]} />
								 <Text style={styles.text}>
								  {"Home" }
								</Text>
							  </View>	   	  
							</View>
				     </TouchableHighlight>
					<View  style={styles.separator}>
					</View>
				     <ListView 
					  dataSource={this.state.dataSource}					  
					 renderRow={this._renderRow}
					 keyboardDismissMode="on-drag"
					 renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
					/>
				</View>
		);
	},
    _renderRow: function(rowData: string, sectionID: number, rowID: number) {
    var rowHash = Math.abs(hashCode(rowData));
	var imgSource = THUMB_URLS[++rowID];
    if(this.state.collapsed===false && this.state.key === rowID )
		var icon=icons['down'];
	else
		var icon=icons['up'];
    return (
      <View >
	 <TouchableHighlight onPress={() => this._pressRow(rowID,rowData)}>
        <View>
          <View style={styles.row}>
             <Image style={styles.thumb} source={imgSource} />
             <Text style={styles.text}>
              {rowData }
            </Text>
			<Image style={styles.icon} source={icon} />			
          </View>	   	  
        </View>
      </TouchableHighlight>
	  {   
		  this.state.key === rowID ?<Collapsible key={rowID} collapsed={this.state.collapsed} align="center">
          <View style={{ flex: 1, padding: 20, backgroundColor: '#fff',}}>
            <ListView
					dataSource={this.state.dataSource1}					  
					 renderRow={this._renderRow_second}
					 keyboardDismissMode="on-drag"
					/>
          </View>
	  </Collapsible>:<Text/>}
      </View>
    );
  },
  _renderRow_second: function(rowData: string, sectionID: number, rowID: number) {	
      return (
	<View>
      <TouchableHighlight onPress={() => this._pressRow_submenu(rowID,rowData)}>
        <View >
          <View style={styles.submenu_first}>            
             <Text style={styles.text}>
              {rowData}
            </Text>
          </View>		
        </View>
      </TouchableHighlight>
	  {   		 
		 this.state.key_1 === rowID?<Collapsible key={rowID} collapsed={this.state.collapsed_1} align="center">
          <View style={{ flex: 1, padding: 20, backgroundColor: '#fff',}}>
               
			   <ListView
					 dataSource={this.state.dataSource2}					  
					 renderRow={this._renderRow_third}
					 keyboardDismissMode="on-drag"
					 renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
					/>
          </View>
	  </Collapsible>:<Text/>}
	 </View>
    );
	
  },
  _renderRow_third: function(rowData: string, sectionID: number, rowID: number) {
   
	return(
	 <TouchableHighlight >
        <View >
          <View style={styles.submenu_second}>            
             <Text style={styles.text}>
              {rowData}
            </Text>
          </View>		
        </View>
      </TouchableHighlight>
	 );
  },
    _pressRow(rowID: number,rowData: string): void {			
		this.getsubdata_source(rowData);
		
		if(this.state.key==rowID && this.state.collapsed==false){
		   this.setState({collapsed:true});						   
		}
		 else{
		   this.setState({collapsed:false});			
		 } 
	  
		 this.setState({key:rowID});	
  }, 
  _pressRow_submenu(rowID: number,rowData: string): void {
		
		 this.getsubdata_source_1(rowData);
		 if(this.state.key_1==rowID && this.state.collapsed_1==false)
		   this.setState({collapsed_1:true});
		 else
			this.setState({collapsed_1:false}); 
		 this.setState({key_1:rowID});	
		 
		 console.log(this.state.app_object[rowData].workflow_states.length);///////////////bottom child
		
		 var workflow_len=this.state.app_object[rowData].workflow_states.length;		 
		 if(workflow_len>0 && this.state.app_object[rowData].workflow_states)
		   this.handle_app_object_click( this.state.app_object[rowData], this.state.app_object[rowData].workflow_states)
	     else
	       this.handle_app_object_click( this.state.app_object[rowData], undefined)
		 
		 this.props.on_closesecond_Event(rowID,rowData);
  }, 
    handle_app_object_click(app_object, workflow_state) :void{
		
		 if (workflow_state) {
			 if (workflow_state.work_queue_app_object_code) {
                app_object.type = "data_list";
                app_object.code = workflow_state.work_queue_app_object_code;
            }
            app_object.workflow_conditions = {workflow_status: workflow_state.status_code};
                   
		 }
		 else{		    
			 delete app_object.workflow_conditions;			  
		 }
		 //console.log(app_object.workflow_conditions);		 
		 this.props.app_object_handler(app_object);
	}, 
  });
	var styles = StyleSheet.create({
			container: {
				flexDirection:'row',
				flex:1,height:35,
				justifyContent: 'space-between',
				 alignItems: 'stretch',
				 flexWrap :'nowrap', 
				 backgroundColor: 'red',
			},
			welcome: {
				fontSize: 20,
				textAlign: 'center',
				margin: 10,
			},
			instructions: {
				textAlign: 'center',
				color: '#333333',
				marginBottom: 5,
			},
			searchRow: {
				 top:5,borderRadius: 1,
				 borderStyle: 'solid',				
				 borderColor:'#D5D5D5',
				 paddingLeft:20,
				 paddingRight:20,
				 flexDirection:'row',
				 borderBottomWidth:3, 
			  },
			  searchTextInput: {
				  flex: 1,
				paddingLeft:10,
				backgroundColor :'#FFFFFF',
				height:24,	
				fontSize:13,
				paddingBottom:1,
				paddingTop:1,								
			  },
			   toolbar: {
				backgroundColor: '#2DC3E8',
				height: 50,
				},
				  text: {
					flex: 1,
				  },
			 row: {
				flexDirection: 'row',
				justifyContent: 'center',
				padding: 5,
				backgroundColor: '#FFFFFF',
			  },
			  row_second: {
				flexDirection: 'row',
				justifyContent: 'center',
				padding: 3,
				backgroundColor: '#F3F3F3',
			  },
			 submenu_first: {				
				justifyContent: 'center',
				padding: 5,
				backgroundColor: '#FFFFFFF',
				borderColor:'#E2E2E2',
				borderLeftWidth:1,
			  },
			  submenu_second: {				
				justifyContent: 'center',
				padding: 5,
				backgroundColor: '#FFFFFFF',
				
			  },
			  separator: {
				height: 1,
				backgroundColor: '#CCCCCC',
			  },
			  thumb: {
				width: 28,
				height: 24,
			  },
			  icon: {
				  top:10,
				width: 10,
				height: 10,
			  },
		});

var THUMB_URLS = [
 require('./images/image/home.png'),
  require('./images/image/gear.png'),
  require('./images/image/custom.png'),
  require('./images/image/pay.png'),  
  require('./images/image/setup.png'),
  require('./images/image/contact.png'),
  require('./images/image/inciden.png'),
  require('./images/image/track.png'),
  require('./images/image/work.png'),
   ];
  var icons = {     //Step 2
            'up'    : require('./images/up.png'),
            'down'  : require('./images/down.png')
  };
   /* eslint no-bitwise: 0 */   
var hashCode = function(str) {
  var hash = 15;
  for (var ii = str.length - 1; ii >= 0; ii--) {
    hash = ((hash << 5) - hash) + str.charCodeAt(ii);
  }
  return hash;
};
var animations = {
  layout: {
    spring: {
      duration: 750,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.4,
      },
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    },
  },
};
var layoutAnimationConfigs = [
  animations.layout.spring,
  animations.layout.easeInEaseOut,
];
module.exports = SideBarSection;