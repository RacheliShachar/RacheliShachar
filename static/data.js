const wsConnection = new WebSocket('ws:127.0.0.1:8085', 'json');
wsConnection.onopen = (e) => {
    console.log(`wsConnection open to 127.0.0.1:8085`, e);
};
wsConnection.onerror = (e) => {
    console.error(`wsConnection error `, e);
};

var localId, peerIds;
var peerConnections = {};
var initiator = false;
// var peersList = []
wsConnection.onmessage = (e) => {
    if (e.data.type != '') {
        switch (JSON.parse(e.data).type) { /////////////////////////////////
            case 'connection':
                localId = JSON.parse(e.data).id;
                break;
            case 'ids':
                console.log("idsssssssssssssssssssss")
                peerIds = JSON.parse(e.data).ids;
                connect();
                break;
            case 'signal':
                signal(JSON.parse(e.data).id, JSON.parse(e.data).data);
                break;
            default:
                break;
        }
    }
};

function onPeerData(id, data) {
    console.log(`data from ${id}`, data);
}

function connect() {
    // console.log("connnnnnnnnnnnnnnnnnnnnnnnnnnnnnnect")
    Object.keys(peerConnections).forEach(id => {
        if (!peerIds.includes(id)) {
            peerConnections[id].destroy();
            delete peerConnections[id];
        }
    });
    if (peerIds.length === 1) {
        initiator = true;
    }

    peerIds.forEach(id => {
        if (id === localId || peerConnections[id]) {
            return;
        }

        let peer = new SimplePeer({
            initiator: initiator
        });
        peer.on('error', console.error);
        peer.on('signal', data => {
            wsConnection.send(JSON.stringify({
                type: 'signal',
                id: localId,
                data
            }));
        });
        // peersList.push({ id: id, name: "" })
        peer.on('data', (data) => onPeerData(id, data));
        peerConnections[id] = peer;
    });
}


function signal(id, data) {
    if (peerConnections[id]) {
        peerConnections[id].signal(data);
    }
}