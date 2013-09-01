var ival = -1;
$(window).load(function(){
	ival = setInterval(function(){
		checkUpdate();
	}, 4000);
	checkUpdate();
});

function createRow(table, data){
	var r = table.insertRow(table.rows.length);
	var sname = r.insertCell(0);
	var sip = r.insertCell(1);
	var stasks = r.insertCell(2);
	var smax = r.insertCell(3);
	var sstatus = r.insertCell(4);
	var sexec = r.insertCell(5);
	sname.appendChild(document.createTextNode(data["name"] + " "));
	var support = document.createElement("small");
	support.style.color="#f88";
	support.appendChild(document.createTextNode(data["support"]));
	sname.appendChild(support);
	sip.appendChild(document.createTextNode(data["ip"]));
	stasks.appendChild(document.createTextNode(data["tasks"] ? data["tasks"].length : "N/A"));
	smax.appendChild(document.createTextNode(data["max"] >= 0 ? data["max"] : "N/A"));
	var statusMsg = "Up";
	if(data["tasks"] && data["tasks"].length > data["max"])
		statusMsg = "Over";
	else if(data["tasks"] && data["tasks"].length == data["max"])
		statusMsg = "Full";
	if(data["max"] == 0)
		statusMsg = "Disabled";
	else if(data["max"] == -1)
		statusMsg = "Offline";
	sstatus.appendChild(document.createTextNode(statusMsg));
	switch(statusMsg){
		default:
		case "Up":
		case "Full":
			sstatus.className = "success";
			break;
		case "Over":
			sstatus.className = "warning";
			break;
		case "Disabled":
		case "Offline":
			sstatus.className = "error";
			break;
	}
	var btnReset = document.createElement('a');
	btnReset.className = "btn btn-danger btn-mini";
	btnReset.style.margin = "0";
	btnReset.innerHTML = "Reset";
	var btnUntask = document.createElement('a');
	btnUntask.className = "btn btn-mini";
	btnUntask.style.margin = "0";
	btnUntask.innerHTML = "Untask";
	var btnGroup = document.createElement('div');
	btnGroup.className = "btn-group";
	btnGroup.appendChild(btnUntask);
	btnGroup.appendChild(btnReset);
	sexec.appendChild(btnGroup);
}

function checkUpdate(){
	var processResp = function(resp){
		if(typeof resp !== "object"){
			try{
				resp = $.parseJSON(resp);
			}catch(e){
				console.log(resp);
				return;
			}
		}
		//Clear the table
		var table = $("#status-table").get(0);
		while(table.rows.length > 1){
			table.deleteRow(1);
		}
		if(resp == null || resp.status != null){
			var row = table.insertRow(1);
			var cell = row.insertCell(0);
			cell.className = "error";
			cell.appendChild(document.createTextNode(resp.status + " " + resp.msg));
			cell.colSpan = "6";
		}else if(resp.peers.length === 0){
			var row = table.insertRow(1);
			var cell = row.insertCell(0);
			cell.appendChild(document.createTextNode("None"));
			cell.colSpan = "6";
			$("#status-info").text("No servers Connected");
		}else{
			var tTasks = 0, tMax = 0;
			for(var i = 0; i < resp.peers.length; i++){
				tMax += resp.peers[i].max >= 0 ? resp.peers[i].max : 0;
				tTasks += resp.peers[i].tasks ? resp.peers[i].tasks.length : 0;
				createRow(table, resp.peers[i]);
			}
			if(tMax == 0) { tMax = 0.001; }
			$("#status-info").text("Connected : " + resp.connected + " Total : " + resp.peers.length + " Tasks Waiting : " + resp.waiting.length + " Tasks Cancelled : " + resp.cancelled.length + " Tasks Error : " + resp.error.length + " Load: " + (Math.round(tTasks * 10000 / tMax) / 100));
		}
	};
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			try{
				var t = JSON.parse(xhr.responseText);
			}catch(e){
				var t = xhr.responseText;
			}
			processResp(t);
		}
	};
	xhr.open("GET", "/admin/api/statusfwd?t=" + (new Date()).getTime(), true);
	xhr.send();
};
