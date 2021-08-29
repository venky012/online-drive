import React from 'react';
import AddIcon from '../AddIcon';
import FileIcon from '../FileIcon';
import Navigation from '../Navigation';
import FolderIcon from '../FolderIcon';
import './styles.css';

class ItemNode  {
    constructor(path, type, children) {
        this.name = path;
        this.type = type;
        this.children = children;
    }
}

class ItemTree {
    constructor() {
        let root = new ItemNode('root','Folder', []);
        this.allItems = {'rootFolder' : root};
    }

    loadTree(allItems) {
        this.allItems = allItems;
    }

    addItem(path, type) {
        let parent = path.substring(0, path.lastIndexOf('/'));
        let children = this.allItems[parent+'Folder'].children;
        if(children.indexOf(path+type) <= -1) {
            children.push(path+type);

            let newItem = new ItemNode(path, type, []);
            this.allItems[path+type] = newItem;

            return this._getAllChildNodes(children);

        } else {
            return null;
        }

    }

    getDirectoryChildren(path) {
        return this._getAllChildNodes(this.allItems[path+'Folder'].children);
    }


    deleteItem(path, type) {
        // remove from all items
        delete this.allItems[path+type];
        // delete all decendents of file aswell
        for(let key in this.allItems){
            if(key.includes(path+'/'))
                delete this.allItems[key];

        }

        // remove from parents children
        let parent = path.substring(0, path.lastIndexOf('/'));
        let children = this.allItems[parent+'Folder'].children;
        let childIndex = children.indexOf(path+type);
        children.splice(childIndex, 1);
        return this._getAllChildNodes(children);
    }

    renameItem(path, newPath, type) {
        let parent = path.substring(0, path.lastIndexOf('/'));
        let children = this.allItems[parent+'Folder'].children;

        // if not already in child
        if(children.indexOf(newPath+type) <= -1) {
            let childIndex = children.indexOf(path+type);
            children[childIndex] = newPath + type;

            let id = newPath + type;
            //rename key
            this.allItems[id] = this.allItems[path+type];
            this.allItems[id].name = newPath;
            delete this.allItems[path+type];

            let stack = []

            if(this.allItems[newPath+type]){
                for(let i = 0;i<this.allItems[newPath+type].children.length;i++){
                    stack.push(this.allItems[newPath+type].children[i]);
                    let s = this.allItems[newPath+type].children[i];
                    // s.replace(path,newPath)
                    let k = 0;
                    while(path[k] === newPath[k]){
                        k += 1;
                    }
                    let ss = newPath + s.substring(k)
                    this.allItems[newPath+type].children[i] = ss;
                    // this.allItems[newPath+type].children[i] = s;
                }
            }
            let j = 0;
            while(path[j] === newPath[j]){
                j += 1;
            }
            console.log(stack)
            while(stack.length!==0){
                let p = stack.pop()
                console.log(p)
                let ps = newPath + p.substring(j)
                this.allItems[ps] = this.allItems[p];
                this.allItems[ps].name = ps.substr(0, ps.length-6);
                delete this.allItems[p];

                for(let i = 0;i<this.allItems[ps].children.length;i++){
                    stack.push(this.allItems[ps].children[i]);
                    let s = this.allItems[ps].children[i];
                    let k = 0;
                    while(path[k] === newPath[k]){
                        k += 1;
                    }
                    let ss = newPath + s.substring(k)
                    this.allItems[ps].children[i] = ss;
                }
            }

            return this._getAllChildNodes(children);

        } else {
            return null;
        }

    }

    _getAllChildNodes(ids) {
        return ids.map(id => {return this.allItems[id]});
    }

}



class Dashboard extends React.Component {
    
    constructor(props){
        super(props);
        let DATA;
        //if data not set make new root directory else load root directory
        if (localStorage.getItem('Data') === null) {
            //item node of current directory
            DATA = new ItemTree();
        } else {
            DATA = new ItemTree();
            let ALLITEMS = JSON.parse(localStorage.getItem("Data"));
            DATA.loadTree(ALLITEMS);
        }
        this.state = {
            data: DATA,
            children: DATA.getDirectoryChildren('root').concat(),
            path: 'root',
            dupliError:false,
        }
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleParentClick = this.handleParentClick.bind(this);
        this.handleItemDelete = this.handleItemDelete.bind(this);
        this.handleRename = this.handleRename.bind(this);
    }
    
    handleAddItem(name, type) {
        let path = this.state.path + '/' + name;
        let children = this.state.data.addItem(path, type, []);
        if (children) {
            this.setState({
                children: children.concat()
            });
            return true;
        } else {
            return false;
        }
    }

    //if folder is clicked update state to display new directory
    handleItemClick(path, type) {
        if(type === 'Folder') {
            let children = this.state.data.getDirectoryChildren(path).concat();

            this.setState({
                children: children,
                path: path,
            });
        } else {
            //if file clicked type do stuff here
        }
    }

    //if the back button is pressed, update state to display parent directory
    handleParentClick() {
        if (this.state.path !== 'root') {
            let parentPath = this.state.path.slice();
            parentPath = parentPath.substring(0, parentPath.lastIndexOf('/'));

            let children = this.state.data.getDirectoryChildren(parentPath);

            this.setState({
                children: children.concat(),
                path: parentPath,
            });
        }

    }


    //delete the passed item from data, update state to display deletion
    handleItemDelete(path, type) {
        let children = this.state.data.deleteItem(path, type);
        this.setState({children: children.concat()});
    }

    //find file in data and rename it, update state
    handleRename(path, newName, type) {
        let newPath = this.state.path + '/' + newName;
        let children = this.state.data.renameItem(path, newPath, type);
        if(children) {
            this.setState({children: children.concat()})
            return true;
        } else {
            return false;
        }
    }

    render(){
        localStorage.setItem('Data',JSON.stringify(this.state.data.allItems));
        let items = this.state.children.concat();
        let files = items.filter((a)=>a.type==='File').sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        let folders = items.filter((a)=>a.type==='Folder').sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        return (
            <>
                <Navigation path={this.state.path} goBackClick={this.handleParentClick} />
                <hr style={{width:'97%'}} />
                <div className="container-fluid wrapper">
                    {
                        folders && folders.map((item) => (
                                <FolderIcon 
                                    type={item.type} 
                                    key={item.name + item.type} 
                                    name={item.name}
                                    onDblClick={this.handleItemClick}
                                    onDeleteClick ={this.handleItemDelete} 
                                    onRenameClick={this.handleRename} />
                        ))
                    }
                    {
                        files && files.map((item) => (
                                <FileIcon 
                                    type={item.type} 
                                    key={item.name + item.type} 
                                    name={item.name}
                                    onDblClick={this.handleItemClick}
                                    onDeleteClick ={this.handleItemDelete} 
                                    onRenameClick={this.handleRename} />
                        ))
                    }
                    <AddIcon addItem={this.handleAddItem} />
                </div>
            </>
        )
    }

}

export default Dashboard;