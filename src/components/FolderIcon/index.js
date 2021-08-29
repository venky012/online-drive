import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import folderIcon from '../../assets/folder.png'
import './styles.css'

class FolderIcon extends React.Component {

    state = {
        modalShow : false,
        type:this.props.type,
        fileName:this.props.name.split('/').pop(),
        dupliError:false,
    }

    handleModalShow = () => {
        this.setState({modalShow : !this.state.modalShow,dupliError:false});
    }

    handleInputChange = (e) =>{
        this.setState({fileName:e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let out = this.props.onRenameClick(this.props.name,this.state.fileName,this.state.type);
        if(out){
            this.handleModalShow();
            this.setState({dupliError:false})
        }
        else{
            this.setState({dupliError:true});
        }
    }

    handleClick = (e) =>{
        // click - for one left click
        if (e.type === 'dblclick') {
            this.props.onDblClick(this.props.name, this.props.type)
        } else if(e.type === 'click'){
            // e.preventDefault();
            // this.setState({rightMenu: true});
        } else if (e.type === 'contextmenu') {
            e.preventDefault();
            this.setState({rightMenu: true});
        }
    }

    render(){
        return (
            <>
                <ContextMenuTrigger id={this.props.name+"-"+this.props.type}>
                    <div className="folder-bg" 
                        onClick={this.handleClick}
                        onDoubleClick={this.handleClick}
                        // onContextMenu={this.handleClick}
                        // onMouseLeave={()=>{this.setState({rightMenu:false})}}
                        >
                        <img src={folderIcon} alt="folder-icon" style={{width:'100px'}} />
                        <p className="para">{this.props.name.split('/').pop()}</p>
                    </div>
                </ContextMenuTrigger>
                <ContextMenu id={this.props.name+"-"+this.props.type}>
                    <MenuItem onClick={this.handleModalShow}>
                        Rename
                    </MenuItem>
                    <MenuItem onClick={()=>this.props.onDeleteClick(this.props.name, this.state.type)}>
                        Delete
                    </MenuItem>
                </ContextMenu>
                <Modal show={this.state.modalShow} onHide={this.handleModalShow}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{margin:'auto auto auto 92px'}}>Rename</Modal.Title>
                    </Modal.Header>
                        <input 
                            type="text" 
                            placeholder="Folder name"
                            style={this.state.dupliError?
                                {width:'250px',margin:'20px auto',height:'38px',borderColor:'red',borderRadius:'10px'}:
                                {width:'250px',margin:'20px auto',height:'38px',borderRadius:'10px'}
                            }  
                            value={this.state.fileName} 
                            onChange={this.handleInputChange} />
                        {
                            this.state.dupliError &&
                            <p
                                style={{width:'250px',margin:'-19px auto auto auto',color:'red',fontSize:'12px'}} 
                            >
                                Folder name already exists!
                            </p>
                        }
                        <button type="submit" className="submit" onClick={this.handleSubmit}>Create</button>
                </Modal>
            </>
        )
    }

}

export default FolderIcon;