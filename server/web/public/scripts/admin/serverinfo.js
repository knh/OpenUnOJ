$(window).load(function(){
	checkServer();
});
function onRequest(resp){
	if(typeof resp !== "object")
		resp = $.parseJSON(resp);
	if(resp == null || resp.status != null){
		$("#stat-current").addClass("error");
		$("#stat-current").removeClass("success");
		$("#stat-server-name").text("Down.");
		$("#stat-server-status").addClass("icon-remove");
		$("#stat-server-status").removeClass("icon-ok");
		$("#stat-node-version").text("Down.");
		$("#stat-server-arch").text("Down.");
		$("#stat-redis").text("Down.");
		$("#stat-dev-mode").text("Down.");
		setTimeout(function(){
			checkServer();
		}, 4000);
	}else{
		$("#stat-current").addClass("success");
		$("#stat-current").removeClass("error");
		$("#stat-server-name").text(resp["server_name"] + " ");
		$("#stat-server-status").addClass("icon-ok");
		$("#stat-server-status").removeClass("icon-remove");
		$("#stat-node-version").text(resp["node_version"]);
		$("#stat-server-arch").text(resp["server_arch"]);
		$("#stat-redis").text(resp["redis"] ? "Enabled" : "Disabled");
		$("#stat-dev-mode").text(resp["dev_mode"] ? "Enabled" : "Disabled");
		if(resp["dev_mode"]){
			$("#stat-dev").addClass("warning");
			$("#stat-dev").removeClass("info");
		}else{
			$("#stat-dev").addClass("info");
			$("#stat-dev").removeClass("warning");
		}
	}
};
function checkServer(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			try{
				var obj = JSON.parse(xhr.responseText);
			}catch(e){
				var obj = xhr.responseText;
			}
			onRequest(obj);
		}
	};
	xhr.open("GET", "/admin/api/serverfwd", true);
	xhr.send();
	
};
