import React from 'react';
import addIcon from '../../assets/add_new_button.png'
import Modal from 'react-bootstrap/Modal';
import './styles.css';

class AddIcon extends React.Component {

    state = {
        modalShow : false,
        format:'Folder',
        fileName:'',
        fileTypeError:false,
        dupliError:false,
    }

    handleModalShow = (e) => {
        this.setState({modalShow : !this.state.modalShow,dupliError:false});
    }

    handleInputChange = (e) =>{
        if(e.target.value.includes('/')){
            this.setState({fileTypeError:true});
        }
        else
            this.setState({fileName:e.target.value,fileTypeError:false});

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let out = this.props.addItem(this.state.fileName,this.state.format)
        if(out){
            this.handleModalShow();
            this.setState({fileName:'',format:'Folder',dupliError:false})
        }
        else{
            this.setState({dupliError:true});
        }
    }

    render(){
        let fileSelected = {
            color: 'white',
            backgroundColor: 'rgb(74, 183, 255)',
            margin: 'auto',
            marginLeft: '-1px',
            width: '43px',
            paddingLeft: '11px',
            paddingBottom: '1px',
            borderRadius: '10px 0px 0px 10px',
            cursor:'pointer',
        }
        let unSelected = {
            color:'black',
            margin:'auto',
            padding:'0px 5px',
            cursor:'pointer',
        }
        let folderSelected = {
            color: 'white',
            backgroundColor: 'rgb(74, 183, 255)',
            margin: 'auto',
            width: '53px',
            marginRight: '-1px',
            paddingLeft: '4px',
            paddingBottom: '1px',
            borderRadius: '0px 10px 10px 0px',
            cursor:'pointer',
        }
        return (
            <>
                <div className="add-icon">
                    <img src={addIcon} onClick={this.handleModalShow} alt="add-icon" style={{width:'75px', height:'90px'}}/>
                </div>
                <Modal show={this.state.modalShow} onHide={this.handleModalShow}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New</Modal.Title>
                    </Modal.Header>
                        <div className="add-toggle">
                            <div 
                                style={this.state.format === 'File'? fileSelected : unSelected}
                                onClick={()=>{this.setState({format:'File'});}}
                            >File</div>
                            <div 
                                style={this.state.format === 'Folder'? folderSelected : unSelected}
                                onClick={()=>{this.setState({format:'Folder'});}}
                            >Folder</div>
                        </div>
                        <input type="text" 
                            placeholder={`${this.state.format} name ...`} 
                            style={this.state.dupliError?
                                {width:'250px',margin:'20px auto',height:'38px',borderColor:'red',borderRadius:'10px'}:
                                {width:'250px',margin:'20px auto',height:'38px',borderRadius:'10px'}
                            } 
                            onChange={this.handleInputChange} 
                            value={this.state.fileName}
                        />
                        {
                            this.state.dupliError &&
                            <p
                                style={{width:'250px',margin:'-19px auto auto auto',color:'red',fontSize:'12px'}} 
                            >
                                {this.state.format} name already exists!
                            </p>
                        }
                        {
                            this.state.fileTypeError &&
                            <p
                                style={{width:'250px',margin:'-19px auto auto auto',color:'red',fontSize:'12px'}} 
                            >
                                {this.state.format} format should not contain '/'
                            </p>
                        }
                        <button className="submit" type="submit" onClick={this.handleSubmit}>Create</button>
                </Modal>
            </>
        )
    }

}

export default AddIcon;