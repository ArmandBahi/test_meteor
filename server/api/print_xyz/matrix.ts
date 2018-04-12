
module.exports = class Matrix {
    constructor(opt_options){
        this.oExtentMatrix = this.createExtentMatrix(opt_options);
    }

    createExtentMatrix(opt_options) {

    	var aExtent = opt_options.extent ? opt_options.extent : [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];
    	// var minZoom = opt_options.minZoom ? opt_options.minZoom : 0;
    	var iZoomLevels = opt_options.iZoomLevels ? opt_options.iZoomLevels : 5;

    	oExtentMatrix = {
    		'0,0,0': aExtent
    	}

    	for (var i = 1; i < iZoomLevels; i++) {
    		oExtentMatrix = this.addMatrixLevel(oExtentMatrix);
    	}

    	return oExtentMatrix;
    }

    completeExtentMatrix(oExtentMatrix, opt_options) {

    	var sStartIndex = opt_options.sStartIndex;
    	var iZoomLevels = opt_options.iZoomLevels;

    	var aStartIndex = sStartIndex.split(',');
    	for (var i = 0; i < aStartIndex.length; i++) {
    		aStartIndex[i] = parseInt(aStartIndex[i]);
    	}

    	var iStartZoomLevel = parseInt(aStartIndex[0]) + 1;

    	if (typeof oExtentMatrix == 'undefined'){
    		console.error("oExtentMatrix not valid");
    		return null;
    	}
    	if (typeof sStartIndex == 'undefined'){
    		console.error("sStartIndex not valid");
    		return null;
    	}
    	if (typeof iZoomLevels == 'undefined'){
    		console.error("iZoomLevels not valid");
    		return null;
    	}
    	if (typeof oExtentMatrix[sStartIndex] == 'undefined') {
    		console.error("sStartIndex not valid");
    		return null;
    	}

    	iZoomLevels = iStartZoomLevel + iZoomLevels;
    	for (var i = iStartZoomLevel; i < iZoomLevels; i++) {
    		oExtentMatrix = this.addMatrixLevelFromIndex(oExtentMatrix, sStartIndex);
    	}

    	return oExtentMatrix;
    }

    addMatrixLevel(oExtentMatrix) {

    	// Récupère l'index du dernier niveau
    	var iLastLevel = 0;
    	for (var key in oExtentMatrix) {
    		if (parseInt(key.substr(0,1)) > iLastLevel) {
    			iLastLevel = key.substr(0,1);
    		}
    	}

    	// Ajoute les enfants du dernier niveau
    	var oChilds;
    	for (var key in oExtentMatrix) {
    		if (key.substr(0,1) == iLastLevel) {
    			oChilds = this.getTileChilds(key, oExtentMatrix[key]);
    			for (var childKey in oChilds) {
    				oExtentMatrix[childKey] = oChilds[childKey];
    			}
    		}
    	}

    	return oExtentMatrix;
    }

    addMatrixLevelFromIndex(oExtentMatrix, sStartIndex) {

    	var aStartIndex = sStartIndex.split(',');
    	for (var i = 0; i < aStartIndex.length; i++) {
    		aStartIndex[i] = parseInt(aStartIndex[i]);
    	}

    	// Récupère l'index du dernier niveau
    	var iLastLevel = 0;
    	for (var key in oExtentMatrix) {
    		if (parseInt(key.substr(0,1)) > iLastLevel) {
    			iLastLevel = parseInt(key.substr(0,1));
    		}
    	}

    	// Nombre de niveaux entre le sStartIndex et dernier en cours
    	if (iLastLevel >= aStartIndex[0]) {
    		iStartDiff = iLastLevel - aStartIndex[0];
    	}

    	var xmin = aStartIndex[1];
    	var ymin = aStartIndex[2];
    	var xmax = aStartIndex[1];
    	var ymax = aStartIndex[2];
    	for (var i = 0; i < iStartDiff; i++) {
    		xmin = (xmin * 2);
    		ymin = (ymin * 2);
    		xmax = (xmax * 2 + 1);
    		ymax = (ymax * 2 + 1);
    	}

    	// Ajoute les enfants du dernier niveau
    	var oChilds, aKey;
    	for (var sKey in oExtentMatrix) {
    		aKey = sKey.split(',');
    		if (parseInt(aKey[0]) == iLastLevel) {
    			if(parseInt(aKey[1]) >= xmin && parseInt(aKey[1]) <= xmax){
    				if(parseInt(aKey[2]) >= ymin && parseInt(aKey[2]) <= ymax){
    					oChilds = this.getTileChilds(sKey, oExtentMatrix[sKey]);
    					for (var childKey in oChilds) {
    						oExtentMatrix[childKey] = oChilds[childKey];
    					}
    				}
    			}
    		}
    	}

    	return oExtentMatrix;
    }

    getTileChilds(sParentIndex, aParentExtent) {

    	var aParentIndex = sParentIndex.split(',');
    	aParentIndex[0] = parseInt(aParentIndex[0]);
    	aParentIndex[1] = parseInt(aParentIndex[1]);
    	aParentIndex[2] = parseInt(aParentIndex[2]);

    	var sTopLeft = (aParentIndex[0] + 1) + ',' + (aParentIndex[1] * 2) + ',' + (aParentIndex[2] * 2);
    	var sTopRight = (aParentIndex[0] + 1) + ',' + (aParentIndex[1] * 2) + ',' + (aParentIndex[2] * 2 + 1);
    	var sBottomLeft = (aParentIndex[0] + 1) + ',' + (aParentIndex[1] * 2 + 1) + ',' + (aParentIndex[2] * 2);
    	var sBottomRight = (aParentIndex[0] + 1) + ',' + (aParentIndex[1] * 2 + 1) + ',' + (aParentIndex[2] * 2 + 1);

    	xmin = aParentExtent[0];
    	ymin = aParentExtent[1];
    	xmax = aParentExtent[2];
    	ymax = aParentExtent[3];

    	var oChilds = {};
    	oChilds[sTopLeft] = [xmin, (ymax + ymin)/2, (xmax + xmin)/2, ymax];
    	oChilds[sTopRight] = [(xmax + xmin)/2, (ymax + ymin)/2, xmax, ymax];
    	oChilds[sBottomLeft] = [xmin, ymin, (xmax + xmin)/2, (ymax + ymin)/2];
    	oChilds[sBottomRight] = [(xmax + xmin)/2, ymin, xmax, (ymax + ymin)/2];

    	return oChilds;
    }
}
