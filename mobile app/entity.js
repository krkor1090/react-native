"use strict";
/**
 ==================================================================================
 Description:       desc
 Creation Date:     2/4/16
 Author:            kostya
 ==================================================================================
 Revision History
 ==================================================================================
 Rev    Date        Author           Task                Description
 ==================================================================================
 1      2/4/16     kostya          TaskNumber          Created
 ==================================================================================
 */
 var server_auth = require('./server_auth');
function invoke_method(entity, method, data, success, error, complete) {
    var request = {};
    request.entity = entity;
    request.method = method;
    request.data = data;
	server_auth.do_authenticated_http_call('api/entity/invoke_method', {
        method: "POST",	
		success: success,		
        headers: {          
            "Content-Type":"application/json"
        },
        body: JSON.stringify(request),
		error: function(err) {
            if (err.responseJSON && error && typeof error === "function") {
                error(err.responseJSON);
            }

            console.log(err);
        },
        complete: complete
		});
}
function log_error(error) {
    var request = {};
    request.entity = "error";
    request.method = "log_error
    request.data = {error:error};
    server_auth.do_authenticated_http_call({
        method: "POST",
        url: "/api/entity/invoke_method",
        contentType: "application/json",
        dataType: 'json',
        body: JSON.stringify(request),
    });
}

function add_or_condition(ret_val, condition) {
    if(!condition) {
        return;
    }
    if(!ret_val["$or"]) {
        var old_ret = ret_val;
        ret_val = {};
        ret_val["$or"] = [old_ret];    }
    ret_val["$or"].push(condition);
    return ret_val;
}
function make_conditions_from_devextreme_filter(filter_arr) { 

    var ret_val;
    ret_val = filter_arr[0];
    if(typeof ret_val == "string") {
        ret_val = parse_condition_obj(filter_arr);
    } else if (typeof ret_val == "function")
	{
        ret_val = parse_condition_obj(filter_arr);
	}
    else if((Object.prototype.toString.call(ret_val) === '[object Array]') || (Object.prototype.toString.call(ret_val) === '[object Object]')) { //an array of conditions joined by and/or
        ret_val = parse_condition_obj(ret_val);
        for (var i = 1; i < filter_arr.length; i++) {
            var condition = filter_arr[i];
            if (condition) {
                if (Object.prototype.toString.call(condition) === '[object Array]') {                   
                    condition = parse_condition_obj(condition);
                    ret_val = add_and_condition(ret_val, condition);
                }
                else if (typeof condition == "string") {
                    if (condition == "and") {
                        i++;
                        condition = parse_condition_obj(filter_arr[i]);
                        ret_val = add_and_condition(ret_val, condition);
                    }
                    else if (condition == "or") {
                        i++;
                        condition = parse_condition_obj(filter_arr[i]);
                        ret_val = add_or_condition(ret_val, condition);
                    }
                }
            }
        }
    }
    return ret_val;
}
function make_conditions_from_devextreme_filter(filter_arr) {    
    var ret_val;
    ret_val = filter_arr[0];
    if(typeof ret_val == "string") {
        ret_val = parse_condition_obj(filter_arr);
    } else if (typeof ret_val == "function")
	{
        ret_val = parse_condition_obj(filter_arr);
	}
    else if((Object.prototype.toString.call(ret_val) === '[object Array]') || (Object.prototype.toString.call(ret_val) === '[object Object]')) { //an array of conditions joined by and/or
        ret_val = parse_condition_obj(ret_val);

        for (var i = 1; i < filter_arr.length; i++) {
            var condition = filter_arr[i];
            if (condition) {
                if (Object.prototype.toString.call(condition) === '[object Array]') {                    
                    condition = parse_condition_obj(condition);
                    ret_val = add_and_condition(ret_val, condition);
                }
                else if (typeof condition == "string") {
                    if (condition == "and") {
                        i++;
                        condition = parse_condition_obj(filter_arr[i]);
                        ret_val = add_and_condition(ret_val, condition);
                    }
                    else if (condition == "or") {
                        i++;
                        condition = parse_condition_obj(filter_arr[i]);
                        ret_val = add_or_condition(ret_val, condition);
                    }
                }
            }
        }
    }
    return ret_val;
}

function make_sorting_conditions_from_devextreme_sort(sort_arr) {
    var ret_val = {};
    for(var i = 0; i < sort_arr.length; i++) { 
        var field_path = sort_arr[i].selector;
        var descending = sort_arr[i].desc;
        ret_val[field_path] = (descending)? -1 : 1;
    }
    return ret_val;
}
var filter_conditions_mongo_equivalent_lookup = {
    "=":"$eq",
    "<>": "$ne",
    ">": "$gt",
    ">=": "$gte",
    "<": "$lt",   
};
function try_parse_regexp(value) {
    if(value && typeof value == "string") {
        var m = value.match(/\/(.*)\/(.*)?/);
        return new RegExp(m[1], m[2] || "");
    }
    return value;
}
function parse_condition_obj(condition_obj) {
    if (!condition_obj || (typeof condition_obj != "object") || (!Array.isArray(condition_obj)) || condition_obj.length !== 3) {
        return null;
    }
    var field_path = condition_obj[0];
    if (typeof field_path == "function")
    {
        field_path = field_path();
    }
    var operator = condition_obj[1];
    var comparison_value = condition_obj[2];

    var sub_doc = {};
    switch (operator) {     
        case "startswith":
        {
            sub_doc["$regex"] = "^" + comparison_value.replace(/ /g, '\\s');
            sub_doc["$options"] = "i";
            break;
        }

        case "endswith":
        {
            sub_doc["$regex"] = comparison_value.replace(/ /g, '\\s') + "$";
            sub_doc["$options"] = "i";
            break;
        }
        case "contains":
        {
            sub_doc["$regex"] = comparison_value.replace(/ /g, '\\s');
            sub_doc["$options"] = "i";
            break;
        }
        case "notcontains":
        {
            sub_doc["$regex"] = comparison_value.replace(/ /g, '\\s');
            sub_doc["$options"] = "i";
            sub_doc = {
                "$not": sub_doc
            };
            break;
        }

        default:
        {
            sub_doc[filter_conditions_mongo_equivalent_lookup[operator]] = comparison_value;
            break;
        }
    }

    var ret_val = {};
    ret_val[field_path] = sub_doc;
    return ret_val;
}

function add_and_condition(ret_val, condition) {
    if(!condition) {
        return;
    }
    if(!ret_val["$and"]) {
        var old_ret = ret_val;
        ret_val = {};
        ret_val["$and"] = [old_ret];
    }
    ret_val["$and"].push(condition);
    return ret_val;
}
var get_clear_state = function () {
    var state_object = {};
    state_object.settings = false;
    state_object.invite_users = false;
    state_object.edit_form = false;
    state_object.data_list = false;
    state_object.app_object_code = false;
    state_object.edit_form_id = undefined;
    state_object.dashboard = false;
    state_object.setup_user = false;
    state_object.reset_password = false;
    state_object.forgot_password = false;
    state_object.search = false;
    state_object.search_string = undefined;
    state_object.user_data_list = false;
    state_object.home = false;
    
    return state_object;
};

function get_parameter_by_name(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function find_index_by_id(array, _id) {
    if(_id && array && array.length > 0) {
        var index;
        for(var i = 0; i < array.length; i++) {
            if(array[i]._id && array[i]._id == _id) {
                index = i;
                break;
            }
        }
        return index;
    }
}

function display_yes_no_dialogue(title, message, callback) {
    DevExpress.ui.dialog.confirm(message, title).done(function(result) {
        if (result) {
            return callback(true);
        }
        else {
            return callback(false);
        }
    });
}

handler_submit: function (event) {
        event.preventDefault();

        if (this.state.password != this.state.confirmed_password) {
            this.setState({error: R.message_passwords_dont_match});
            return;
        }

        var request = {};
        request.setup_token = get_parameter_by_name("setup_token");
        request.username = this.state.username;
        request.password = this.state.password;
        request.email_address = this.state.email;
        request.secret_question = this.state.secret_question;
        request.secret_answer = this.state.secret_answer;
        this.setState({loading: true});

        var context = this;
        $.post("/api/auth/setup_user", request, function (data) {
            if (data) {
                if (data.success) {
                    context.setState({completed: true});
                    Notify(R.message_successfully_registered, 'bottom-right', 20000, 'green', 'fa-check', true);
                    context.props.on_success();
                }
                else {
                    context.setState({error: data.message});
                }

                console.log(data);
            }
        }).fail(function (error) {
            error = error.responseJSON;           
            context.setState({error: error.message});
        }).complete(function () {
            if (!context.state.completed) {
                context.setState({loading: false});
            }
        });
    },
 get_sect_questions: function () {
        var context = this;

        $.ajax({
            method: "GET",
            url: "/api/auth/get_secret_questions",
            success: function (data) {
                context.setState({secret_questions: data});
            },
            error: function (err) {
                console.log(err);
            },
        })
    },
	init_search: function() {
        var search_string = this.props.search_string;

        var request = {};
        request.data = {search_string:search_string};
        var context = this;

        do_authenticated_http_call({
            method: "POST",
            url: "/api/entity/full_text_search",
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(request),
            success: function(data) {
                context.setState({search_results: data.data});            

                push_href_location(search_string + " - " + (R.client_application_title || "Xenforma"), "/search?search_string="+search_string);
            },
            error: function(error) {
                if (error.responseJSON) {                  
                    context.setState({error:error.responseJSON.message})
                }
            },
            complete: function() {
            }
        });
    },
	post_init: function (entity_attributes) {
        var context = this;

        if (!entity_attributes) {
            entity_attributes = this.state.entity_attributes;
        }
        for (var i = 0; entity_attributes && i < entity_attributes.attributes.length; i++) {
            var attribute = entity_attributes.attributes[i];

            if (!attribute.form_visible) {
                continue;
            }

            if (attribute.is_nested_entity && attribute.data_is_nested == false) {
                //if (attribute.is_array)
                this.refresh_reference_grid(attribute);
            }
        }
    },
    refresh_reference_grid: function (attribute, callback) {
        var context = this;
        //if (attribute.is_nested_entity && attribute.data_is_nested == false && attribute.is_array) {
        var entity = attribute.db_type;

        var request = {};
        request.app_object_code = this.props.app_object_code || this.props.data.app_object_code || this.props.data.app_object.code;

        var success = function (attribute) {
            return function (data) {
                data = data.data;
                if (!attribute.select_options) {
                    attribute.select_options = [];
                }
                attribute.select_options.length = 0;
                attribute.select_options.push.apply(attribute.select_options, data);
                //attribute.select_options = data;
                if (callback) {
                    callback(data);
                }
                context.forceUpdate();
            }
        }(attribute);

        var error = function (error) {
            console.log(error);
        };

        invoke_method(entity, "read_with_nested_permissions", request, success, error);
        //}
    },
    populate_update_fields: function (entity_attributes, entity_instance_data, out_val) {
        if (!out_val) {
            out_val = this.state.update_fields || {};
        }
        for (var i = 0; i < entity_attributes.attributes.length; i++) {
            var attribute = entity_attributes.attributes[i];

            if (attribute.form_visible) {
                var attribute_value;

                attribute_value = entity_instance_data[attribute.field_path];

                out_val[attribute.field_path] = attribute_value;
            }
        }
        return out_val;
    },
    on_file_name_change: function (attribute, file) {
        if (file) {
            this.state.update_fields['file_name'] = file.name;
            this.state.entity_instance['file_name'] = file.name;
        }
        else {
            this.state.update_fields['file_name'] = null;
            this.state.entity_instance['file_name'] = null;
        }
        this.setState({fileToUpload: file});
    },
