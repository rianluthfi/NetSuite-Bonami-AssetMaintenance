 /**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record','N/format', 'N/search'],
    function(currentRecord, record, format, search) {
        function pageInit(context) {

        }
        function saveRecord(context) {

        }
        function validateField(context) {
			var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var line = context.line;
			
			var isAMTrans = currentRecord.getValue('custbody_am_is_am_trans');
			
			if (isAMTrans){
				if (sublistName === 'expense') {
					if (sublistFieldName === 'custcol_far_trn_relatedasset') {
					   var assetID = currentRecord.getCurrentSublistValue({
						   sublistId : sublistName,
						   fieldId : sublistFieldName
					   });
					   
					   var expenseAcc = getExpense(assetID);
					   
					   currentRecord.setCurrentSublistValue({
						   sublistId : sublistName,
						   fieldId : 'account',
						   value: expenseAcc
					   });
					   
					   var AMInfo = getAMInfo(assetID);
					   
					   currentRecord.setCurrentSublistValue({
						   sublistId : sublistName,
						   fieldId : 'custcol_bcg_asset_maint_info',
						   value: AMInfo
					   });
					}
				}
			}
            
            return true;
        }
        function fieldChanged(context) {

        }
        function postSourcing(context) {
			
        }
        function lineInit(context) {

        }
        function validateDelete(context) {

        }
        function validateInsert(context) {
			
        }
        function validateLine(context) {
			
        }
        function sublistChanged(context) {

        }
		
		function getExpense(id){
			var mAsset = record.load({
				type: 'customrecord_ncfar_asset', 
				id: id,
				isDynamic: true,
			});
			
			var typeId = mAsset.getValue('custrecord_assettype');
			
			var mAssetType = record.load({
				type: 'customrecord_ncfar_assettype', 
				id: typeId,
				isDynamic: true,
			});
			
			var expenseAcc = mAssetType.getValue('custrecord_bcg_acc_maint_expense');
			
			return expenseAcc;
		}
		
		function getAMInfo(id){
			var mAsset = record.load({
				type: 'customrecord_ncfar_asset', 
				id: id,
				isDynamic: true,
			});
			
			var maintInfo = 'a';
			var ID = mAsset.getText('name');
			var name = mAsset.getText('altname');
			var statusInspection = mAsset.getText('custrecord_bcg_status_inspection');
			var lastInspection = mAsset.getText('custrecord_assetmaintlastdate');
			var inspectionInterval = mAsset.getValue('custrecord_assetmaintinspinterval');
			var nextInspection = mAsset.getText('custrecord_assetmaintnextdate');
			var warrantyStart = mAsset.getText('custrecord_assetmaintwarrantystart');
			var warrantyPeriod = mAsset.getValue('custrecord_assetmaintwarrantyperiod');
			var warrantyEnd = mAsset.getText('custrecord_assetmaintwarrantyend');
			
			maintInfo = 'Asset Name = '+ID+' '+name+'; '+ 
						checkData('Status Inspection', statusInspection)+
						checkData('Last Inspection', lastInspection)+
						checkData('Inspection Interval', inspectionInterval)+
						checkData('Next Inspection', nextInspection)+
						checkData('Warranty Start', warrantyStart)+
						checkData('Warranty Period', warrantyPeriod)+
						checkData('Warranty End', warrantyEnd);
						
			return maintInfo;
		}
		
		function checkData(label, data){
			if (data == '' || data == undefined){
				return '';
			}else{
				var dataContent = 	'\n'+ label + ' = '+data+';';
				return dataContent;
			}
		}
			
        return {
            // pageInit: pageInit,
            // fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };
    });