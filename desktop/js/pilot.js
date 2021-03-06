
/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */


$("#table_cmd").sortable({axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
/*
 * Fonction pour l'ajout de commande, appellé automatiquement par plugin.template
 */
function addCmdToTable(_cmd) {
    if (!isset(_cmd)) {
        var _cmd = {configuration: {}};
    }
    if (!isset(_cmd.configuration)) {
        _cmd.configuration = {};
    }
    var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">';
    tr += '<td>';
    tr += '<span class="cmdAttr" data-l1key="id" style="display:none;"></span>';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="name" style="width : 140px;" placeholder="{{Nom}}">';
    tr += '</td>';
    tr += '<td>';
    tr += '<span class="type" type="' + init(_cmd.type) + '">' + jeedom.cmd.availableType() + '</span>';
    tr += '<span class="subType" subType="' + init(_cmd.subType) + '"></span>';
    tr += '</td>';
    tr += '<td>';
    tr += '<span><input type="checkbox" class="cmdAttr " data-l1key="isVisible" checked/> {{Afficher}}<br/></span>';
    tr += '<span><input type="checkbox" class="cmdAttr " data-l1key="isHistorized" /> {{Historiser}}<br/></span>';  
    tr += '</td>';  
    tr += '<td>';
    if (is_numeric(_cmd.id)) {
        tr += '<a class="btn btn-default btn-xs cmdAction" data-action="configure"><i class="fa fa-cogs"></i></a> ';
        tr += '<a class="btn btn-default btn-xs cmdAction" data-action="test"><i class="fa fa-rss"></i> {{Tester}}</a>';
    }
    tr += '<i class="fa fa-minus-circle pull-right cmdAction cursor" data-action="remove"></i>';
    tr += '</td>';
    tr += '</tr>';
    $('#table_cmd tbody').append(tr);
    $('#table_cmd tbody tr:last').setValues(_cmd, '.cmdAttr');
    if (isset(_cmd.type)) {
        $('#table_cmd tbody tr:last .cmdAttr[data-l1key=type]').value(init(_cmd.type));
    }
    jeedom.cmd.changeType($('#table_cmd tbody tr:last'), init(_cmd.subType));
}

function printEqLogic(_eqLogic){
    $.ajax({// fonction permettant de faire de l'ajax
        type: "POST", // méthode de transmission des données au fichier php
        url: "plugins/pilot/core/ajax/pilot.ajax.php", // url du fichier php
        data: {
            action: "getQrCode",
            id: _eqLogic.id,
        },
        dataType: 'json',
        global: false,
        error: function (request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function (data) { // si l'appel a bien fonctionné
        if (data.state != 'ok') {
            $('#div_alert').showAlert({message: data.result, level: 'danger'});
            return;
        }


        $('.warningMessages').empty();
        $('.qrCodeImg').empty();
    
        if(data.result['error']) {
            if(data.result['error'] == 'noUser') {
                $('.warningMessages').append('{{Merci de bien vouloir sélectionner un utilisateur.}}');
            }
            if(data.result['error'] == 'noUrlInterne') {
                $('.warningMessages').append('{{Merci de bien vouloir définir une URL interne pour votre serveur Jeedom, dans la configuration de votre serveur.}}');
            }
        }
        else {

            if(data.result['warning']) {
                if(data.result['warning'] == 'noUrlExterne') {
                    $('.warningMessages').append('{{Avertissement : aucune URL externe n\'a été définie pour votre serveur. Pilot ne pourra donc pas s\'y connecter de l\'extérieur. }}');
                }
                if(data.result['warning'] == 'noApiKey') {
                    $('.warningMessages').append('{{Avertissement : aucune clé API définie. Définir une clé API vous permet de recevoir les notifications PUSH sur votre appareil. }}');
                }
            }
            if(data.result['result']) {
                $('.qrCodeImg').empty().append('<img src='+data.result['result']+' />');
            }

        }

        

        
        
        
    }
});
}
