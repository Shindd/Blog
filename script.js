// initialize
function initialize(){
    SET_BOX_SIZE_AUTO();
    SET_TEXTAREA_SIZE_AUTO();
    CLEAR_TEXTAREA();
    ADD_EVENTHANDLER_ON_WINDOW();
    ADD_EVENTHANDLER_ON_TEXTAREA();
}

// clear textarea box
function CLEAR_TEXTAREA(){$('textarea').val("");}

// set components size
function SET_BOX_SIZE_AUTO(){
    // get screen height size
    var window_height_pixel_size = screen.height;
    var container_box_height_size = window_height_pixel_size-250;
    
    // set container-box class height size
    $('div.container-box').css('height', container_box_height_size);
}

function SET_TEXTAREA_SIZE_AUTO(){
    // get pixel size
    var width_pixel_size = $('#memo-box').width();
    var height_pixel_size = $('#memo-box').height();
    var char_textarea_cols = (width_pixel_size-15) / 8;
    var char_textarea_rows = (height_pixel_size-42) / 20;
    
    // set textarea cols & rows
    $('textarea').attr('cols', char_textarea_cols);
    $('textarea').attr('rows', char_textarea_rows);
}

// add handlers on components
function ADD_EVENTHANDLER_ON_WINDOW(){
    window.onresize = function(event){
        SET_TEXTAREA_SIZE_AUTO();  
    };
}

function ADD_EVENTHANDLER_ON_TEXTAREA(){
    // add change handler on memo-textarea
    // listen 'ENTER' key
    $('#memo-textarea').keyup(function(e){
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13 || code == 32){ // press ENTER or SPACE
            update_view_textarea( $('#memo-textarea').val());
        }
        /*
        else if( code == 51){ // press #
            
        }
        else if( code == 8){ // press backspace
            
        }
        else {
            
        }
        */
    });
}

// class for text
function Block(_type, _contents, _taps){
    this.word_type = _type;
    this.contents = _contents;
    this.tap_count = _taps; 
}

// analyze splited contents blocks
var RESERVED_WORDS = {
    'normal' : {description:'normal words', start_tag:'', end_tag: ''},
    'RL' : {description:'red line', start_tag:'<font color="red">', end_tag:'</font>'}, 
    'BH' : {description:'head', start_tag:'<h1>', end_tag:'</h1>'},
    'SH' : {description:'small head', start_tag:'<h3>', end_tag:'</h2>'},
    'HR' : {description:'horizon line', start_tag:'<hr>', end_tag:''},
    'SL' : {description:'list start', start_tag:'<ul>', end_tag:''},
    'EL' : {description:'list end', start_tag:'', end_tag:'</ul>'},
    'LC' : {description:'list contents', start_tag:'<li>', end_tag:'</li>'},
}

function analyze_contents_blocks( _blocks){
    var STACK_OF_BLOCKS = Array();
    var ARRAY_OF_BLOCKS = Array();
    var CURRENT_TAPS = 0;
    var block_size = _blocks.length;
    
    ARRAY_OF_BLOCKS.push(new Block('normal', _blocks[0], 0))
    
    for( var idx = 1; idx < block_size; idx++){
        var _block = _blocks[idx];
        
        // case: block by block "#~##~"
        if( _block.length < 2){
            ARRAY_OF_BLOCKS.push(new Block('normal', _block, CURRENT_TAPS));
            continue;
        }
        
        // get the keyword
        var keyword = (_block[0] + _block[1]).toUpperCase();
        // put contents the rest
        var contents = '';
        if(_block.length > 2) contents = _block.substr(2);

        // keyword is reserved?
        if( keyword in RESERVED_WORDS){
            if( keyword == 'HR' || keyword == 'BH' || keyword == 'SH') 
                // push BLOCK object in ARRAY_OF_BLOCKS
                ARRAY_OF_BLOCKS.push(new Block(keyword, contents, CURRENT_TAPS));
            else {
                // associate with list
                if(keyword == 'EL') {
                    CURRENT_TAPS--;
                    ARRAY_OF_BLOCKS.push(new Block('EL', '', CURRENT_TAPS));
                    keyword = 'normal';
                }
                ARRAY_OF_BLOCKS.push(new Block(keyword, contents, CURRENT_TAPS));
                if(keyword == 'SL') CURRENT_TAPS++;
            }
        }
        else {
            contents = _block[0] + _block[1] + contents;
            ARRAY_OF_BLOCKS.push(new Block('normal', contents, CURRENT_TAPS));
        }
    }
    
    // pop stack
    for( var idx = 0; idx < STACK_OF_BLOCKS.length; idx++){
        top_block = STACK_OF_BLOCKS.pop();
        ARRAY_OF_BLOCKS.push( top_block);    
        if(top_block.word_type == 'LH') CURRENT_TAPS--;
    }
    
    return ARRAY_OF_BLOCKS;
}

// textarea update functions
function update_view_textarea( _text){
    var memo_box_text_origin = _text;
    var memo_box_text_length = memo_box_text_origin.length;
    var splited_contents = analyze_contents_blocks(_text.split('#'));  
    show_contents_on_view( $('#view-container') , splited_contents);
}

// show contents on view div
function show_contents_on_view(_view, _blocks){
    // clear the view box
    _view.empty();
    
    // add contents with html tag
    var block_size = _blocks.length;
    var _cmd = '<div>';
    for(var idx = 0; idx < block_size; idx++){
        var block = _blocks[idx];
        // add taps
        for( var temp=0; temp < block.tap_count; temp++) _cmd += '</t>';
        _cmd += RESERVED_WORDS[block.word_type].start_tag + block.contents + RESERVED_WORDS[block.word_type].end_tag;
    }
    _cmd += '</div>'
    _view.append(_cmd);
}