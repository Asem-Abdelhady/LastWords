import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

function LastWordsModal({ isVisible, onClose, name, lastWords }) {
    return (
        <Modal show={isVisible} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{name}'s last words </Modal.Title>
            </Modal.Header>
            <Modal.Body>{lastWords}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default LastWordsModal
