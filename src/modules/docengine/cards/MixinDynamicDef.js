/*
 * 	This file is part of ELCube.
 *	ELCube is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	ELCube is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
 */
export default {

    filters:{
        boolFormat : (value)=>{return value?'是':'否'},
    },
    data(){
        return {
            sortable:true,
            inputTypeDefs:[],
            activeRow:undefined,
        }
    },
    created() {
        if(this.$nkSortableVxeTable)
            this.$nkSortableVxeTable(true);
        if(!this.def.items){
            this.$set(this.def,'items',[]);
        }
    },
    computed:{
        fieldDefComponent(){
            if(this.activeRow && this.activeRow.inputType){
                const defName = this.activeRow.inputType + 'Def';
                if(this.$options.components[defName]){
                    return defName;
                }
            }
            return undefined;
        }
    },
    methods:{
        boolFormat : ({cellValue})=>{return cellValue?'是':''},
        activeMethod(){return this.editMode;},
        keyChanged({column,row},{value}){
            row[column.property]=value && (value.substring(0,1).toLowerCase() + value.substring(1));
        },
        inputTypeChanged({row}){
            row.$options = this.inputTypeDefs.find(e=>e.value===row.inputType).options;
            for(let key in row.$options){
                this.$set(row,key,row.$options[key]);
            }
        },
        rowEditClosed(){
        },
        rowEditActived({row}){
            this.$refs.xTable.setRowExpand([row], true);
            this.rowExpand({row, expanded:true});
        },
        rowExpand({row,expanded}){
            // 初始化inputOptions的值，避免双向绑定数据失败
            if(!row.inputOptions){
                this.$set(row,'inputOptions',{});
            }

            if(expanded){
                this.activeRow = row;
            }

            // 获取当前展开的所有行(除当前行外)，并将其收起
            const expandRecords = this.$refs.xTable.getRowExpandRecords();
            expandRecords.splice(expandRecords.indexOf(row),1);
            this.$refs.xTable.setRowExpand(expandRecords, false);

            this.sortable = this.$refs.xTable.getRowExpandRecords().length === 0;
            this.$nkSortableVxeTable(this.sortable);
        },
        rowExpandClear(){
            this.$refs.xTable.clearRowExpand();
            this.sortable = this.$refs.xTable.getRowExpandRecords().length === 0;
            this.$nkSortableVxeTable(this.sortable);
        },
    }
}