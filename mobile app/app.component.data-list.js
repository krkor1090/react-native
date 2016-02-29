"use strict";
/**
 ==================================================================================
 Description:       desc
 Creation Date:     2/1/16
 Author:            Kostya
 ==================================================================================
 Revision History
 ==================================================================================
 Rev    Date        Author           Task                Description
 ==================================================================================
 1       2/1/16     Kostya          TaskNumber          Created
 ==================================================================================
 */
 var React = require('react-native');
 var server_auth = require('./server_auth');
 var ForerunnerDB = require("forerunnerdb");
 //var GridView = require('react-native-grid-view');
 var fdb = new ForerunnerDB(); 
 var db = fdb.db('xenforma');
 var GridView = require('rn-grid-view');
 var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,	
	ListView,Image,
	TouchableHighlight,
	LayoutAnimation,
	ScrollView
    } = React;
	var loop_val=0;
var DataListComponent = React.createClass({
  getInitialState: function() {	
  
     var state;	
	 var context = this;
	 
	 //var state = this.initialize_data_list();

        if (!state) { //placeholder while waiting for response.
            state = {};
        }
		
		var col=[];
			for(var i=0;i<4;i++){
				col.push({id:i,image:"tt"});
			};
			
			
		/**
		context.setState({
                    app_object: context.props.app_object,
                    entity_attributes: context.props.entity_attributes,
                    entity_instances: []
                });		

  **/				
      // context.setState({gett:context.props.app_object_o});
	   //state.grid_id = makeid();
        //state.scrollViewContentElementId = makeid();	
	  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      var data = Array.apply(null, {length: 20}).map(Number.call, Number);
       
	   return {
             books : {
                      "Finished Reading": col
                                          ,"": col
                     }
           }
       // return state;	 
  },
  initialize_data_list: function () {
        if (this.props.skip_init) {
			
            var state_object = {};
            state_object.app_object = this.props.app_object;
            state_object.entity_attributes = this.props.entity_attributes;
            state_object.entity_instances = this.props.entity_instances;
            return state_object;
        }
        var request = {};
        request.entity = "app_object";
        request.method = "get_by_code";
        request.data = {app_object_code: this.props.app_object_code, conditions: this.props.conditions};

        var context = this;
		server_auth.do_authenticated_http_call('api/entity/invoke_method', {
        method: "POST",				
        headers: {          
            "Content-Type":"application/json"
        },
        body: JSON.stringify(request)
		}).then((response) => {	
		   response.json().then(function(json_response) {	
		    console.log(json_response.data.entity_attributes);
			console.log("ccccccccccc");
			   context.setState({
                    app_object: json_response.data.app_object,
                    entity_attributes: json_response.data.entity_attributes,
                    entity_instances: []
                });				
				//push_href_location(json_response.data.app_object.name + " - " + (R.client_application_title || "Xenforma"), "/data_list?code=" + data.data.app_object.code);
			  
		   }).catch(function(err) {
			  context.setState({error: err.responseJSON.message});             
           }); 
		}).catch(function(err) {
			context.setState({error: err.responseJSON.message}); 
		});
    },
	componentDidMount: function (){
		/**
		console.log(this.state.app_object);
		if (this.state.app_object) {
            //this.init_grid();			
        }
		console.log("componentDidMount");
		
		**/
	},
	componentDidUpdate: function () {
		var context=this;
		var data_source;		
		/**
		 if (this.state.app_object && !this.props.skip_init) {
            var request = {};
			request.entity = context.state.entity_attributes.entity;
			//request.method = "find_paged";
			request.method = "read";
			var send_data = {
            conditions: {},
            last_id: undefined
			};
			var conditions = context.props.conditions || {};
			send_data.conditions = conditions;
			send_data.skip = undefined;
			send_data.sort = undefined;			
			//request.data=send_data;
			//var request = {};
			//request.entity="contract Types";
		
			server_auth.do_authenticated_http_call('api/entity/invoke_method', {
				method: "POST",				
				headers: {          
					"Content-Type":"application/json"
				},
				body: JSON.stringify(request)
				}).then((response) => {
				   response.json().then(function(json_response) {			 
					 //  console.log(json_response);		
                      // console.log("jjjjssosos");
				   }).catch(function(err) {
					  context.setState({error: err.responseJSON.message});             
				   }); 
				}).catch(function(err) {
					context.setState({error: err.responseJSON.message}); 
				});
		   console.log("updateDidMount");
        }	
		**/		
	},
	 _renderHeader: function(data, id) {
    return (<View style={styles.header}>
              
            </View>);
    },
	  _renderBook: function(item) {
    return (
            <View key={item.id} style={styles.contain}>
              <Text style={styles.thumb}>{item.caption}</Text>
			 
            </View>
           )
    },
	render:function() { 
	
	  var columns = [];
      var context = this;	 
	 console.log("rendser_submenu");
	 /**
	  for (var i = 0; context.state.entity_attributes && i < context.state.entity_attributes.attributes.length; i++) {
	        
			var attribute = context.state.entity_attributes.attributes[i];
			
            if (!attribute.list_visible) {
                continue;
            }
			if (attribute.type == "Mixed" || attribute.is_array) {
                continue;
            }
			var column = {dataField: attribute.field_path, caption: attribute.caption};
			console.log(column);
			if (attribute.list_of_values) {
			
                var tempAttribute = attribute.list_of_values;
                column.allowHeaderFiltering = true;
                column.headerFilter = {
                    dataSource: {
                        load: function (loadOptions) {
                            var res = [];
                            for (var i = 0; i < tempAttribute.length; i++) {
								
                                res.push({text: tempAttribute[i].value, value: tempAttribute[i].code});
                            }
                            return res;
                        }
                    }
                }
            }
            else {
                column.allowHeaderFiltering = false;
            }
			var type = attribute.attribute_type == null ? attribute.db_type : attribute.attribute_type;
			columns.push(column);
			
	  }
	  **/
	  this.state.columns = columns;
	  var app_object_name = this.state.app_object ? this.state.app_object.name : "";
	  //this.state.dataSource=this.state.ds.cloneWithRows(data);
	  var header_caption=this.props.header_caption?this.props.header_caption:[];
	  var header_length=this.props.header_length?this.props.header_length:0;
	 
	  return(
	     
		<ScrollView
			automaticallyAdjustContentInsets={false}
			horizontal={true}
			style={[styles.scrollView, styles.horizontalScrollView]}>
			<GridView
              itemsPerRow={header_length}
              renderFooter={null}
              onEndReached={null}
              scrollEnabled={true}
              renderSeparator={null}
              style={{marginTop: 10}}
              items={header_caption}
              fillIncompleteRow={false}
              renderItem={this._renderBook}
              renderSectionHeader={this._renderHeader}
              automaticallyAdjustContentInsets={false} />
        </ScrollView>
	  );
	},
	renderItem: function(item) {
		return <Text> {item}</Text>
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
			list: {
				flexDirection: 'row',
				flexWrap: 'wrap'
			},
			item: {
				backgroundColor: 'red',
				margin: 3,
				width: 50
			},
			scrollView: {
				backgroundColor: '#FFFFFF',
				height: 300,
			},
			horizontalScrollView: {
				height: 120,
			},
			headerText: {
			fontSize: 18,
			fontWeight: '700',
			textAlign: 'center',
		   
			color: "white",
		  },
		   header: {
			backgroundColor: '#1CC839',
		  },
		  thumb: {
			width: 115,
			height: 20,   
			margin: 1,
            fontSize: 10,	
		  },
		  contain:{
			borderWidth:1,
			borderColor:'#D3D3D3'	
		 },
});
module.exports = DataListComponent;