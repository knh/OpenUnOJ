var model = "";
var revisions = [];
function loadLang(editor, lang){
	switch(lang){
		case "c":
			editor.setOption("mode","text/x-csrc");
			model = "#include <stdio.h>\nint main(){\n    \n    return 0;\n}";
			break;
		case "cpp":
			editor.setOption("mode","text/x-c++src");
			model = "#include <iostream>\nusing namespace std;\n\nint main(){\n    \n    return 0;\n}";
			break;
		case "php":
			editor.setOption("mode","php");
			model = "<? \n    \n?>";
			break;
		case "java":
			editor.setOption("mode","text/x-java");
			model = "public class Main{\n    public static void main(String [] args){\n        \n    }\n}";
			break;
		case "littlelisp":
			editor.setOption("mode","text/x-common-lisp");
			model = "";
			break;
		default:
			model = "";
	}
};

window.addEventListener('load', function(){
	var mode = "editor";
	
	$("#bUpload").click(function(e){
		e.preventDefault();
		if(mode != "upload"){
			$(".x-upload").css("display", "");
			if(mode === "editor"){
				$(".x-editor").css("display", "none");
				$(".x-editor-btn").css("display", "none");
			}else if(mode === "diff"){
				$(".x-merge").css("display", "none");
			}
			mode = "upload";
		}else{
			$(".x-upload").css("display", "none");
			$(".x-editor").css("display", "");
			$(".x-editor-btn").css("display", "");
			mode = "editor";
		}
	});
	var diff = null;
	var editor = CodeMirror.fromTextArea(document.getElementById('code'),{
		mode:"text/x-csrc",
		lineNumbers: true,
		matchBrackets: true,
		indentUnit: 4,
		extraKeys: {
			"F11": function(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
				if(cm.getOption("fullScreen")){
					$("#submitter").addClass("fullscreen");
				}else{
					$("#submitter").removeClass("fullscreen");
				}
			},
			"F10": function(cm) {
				revisions.push(cm.getValue());
				$("#sRevisions").html(revisions.length);
			},
			"F9": function(cm) {
				if(revisions.length > 0){
					cm.setValue(revisions.pop());
					$("#sRevisions").html(revisions.length);
				}
			},
			"Esc": function(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
				$("#submitter").removeClass("fullscreen");
			}
		}
	});
	
	$("#bSave").click(function(e){
		e.preventDefault();
		revisions.push(editor.getValue());
		$("#sRevisions").html(revisions.length);
	});
	
	$("#bModel").click(function(e){
		e.preventDefault();
		editor.setValue(model);
	});
	
	$("#bDiff").click(function(e){
		e.preventDefault();
		if(mode === "editor"){
			if(revisions.length < 1){
				return;
			}
			
			$(".x-merge").html("");
			$(".x-editor").css("display","none");
			$(".x-editor-btn").css("display","none");
			$(".x-merge").css("display","");
			$("#bDiff").css("display","");
			
			diff = CodeMirror.MergeView($(".x-merge").get(0), {
				value:editor.getValue(),
				orig:revisions[revisions.length - 1],
				lineNumbers:true,
				mode:editor.getOption("mode"),
				highlightDifferences: true,
				extraKeys:{
					"F10":function(cm){
						revisions.push(cm.getValue());
						$("#sRevisions").html(revisions.length);
						//Update self
						mode = "editor";
						editor.setValue(diff.editor().getValue());
						$("#bDiff").get(0).click();
					},
					"F11":function(cm){
						if(!$("#submitter").hasClass("fullscreen")){
							$(".x-merge").addClass("fullscreen");
							$("#submitter").addClass("fullscreen");
							cm.refresh();
							try{
								cm.mv.right.orig.refresh();
							}catch(e){}
						}else{
							$(".x-merge").removeClass("fullscreen");
							$("#submitter").removeClass("fullscreen");
							cm.refresh();
							try{
								cm.mv.right.orig.refresh();
							}catch(e){}
						}
					}
				}
			});
			
			mode = "diff";
			
		} else {
			$(".x-merge").css("display","none");
			$(".x-editor-btn").css("display","");
			$(".x-editor").css("display","");
			if(diff){
				editor.setValue(diff.editor().getValue());
			}
			mode = "editor";
		}
	});
	
	$("#language").on("change", function(){
		loadLang(editor, this.value);
	});
	
	$("#bShowDiffHelp").click(function(e){
		e.preventDefault();
		$("#bShowDiffHelp").css("display","none");
		$("#sDiffHelp").css("display","");
	});
	
	loadLang(editor, $("#language").get(0).value);
});
