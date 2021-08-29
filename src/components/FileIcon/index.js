import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import fileIcon from '../../assets/file.png'
import './styles.css';

class FileIcon extends React.Component {
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
        let out = this.props.onRenameClick(this.props.name,this.state.fileName,this.state.type);
        if(out){
            this.handleModalShow();
            this.setState({dupliError:false})
        }
        else{
            this.setState({dupliError:true});
        }
    }

    render(){
        return (
            <>
                <ContextMenuTrigger id={this.props.name+"-"+this.props.type}>
                    <div className="file-bg">
                        <img src={fileIcon} alt="file-icon" style={{width:'100px', height:'100px'}}/>
                        <p className="ext">.{this.props.name.split('.').pop()}</p>
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
                            placeholder="File name"
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
                                File name already exists!
                            </p>
                        }
                        <button type="submit" className="submit" onClick={this.handleSubmit}>Create</button>
                </Modal>
            </>
        )
    }

}

export default FileIcon;