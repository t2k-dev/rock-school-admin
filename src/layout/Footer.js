import { Container } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="bg-light text-dark py-3 mt-5"
      style={{ 
        position: 'relative',
        bottom: 0,
        width: '100%',
        marginTop: 'auto'
      }}
    >
      <Container>
        <div className="text-center">
          <p className="mb-1">
            &copy; {currentYear} Rock School Admin. Все права защищены.
          </p>
          <p className="mb-0">
            <span>Контакты: </span>
            <a 
              href="mailto:info@rockschool.kz" 
              className="text-dark"
              style={{ textDecoration: 'underline' }}
            >
              t2k.devel@gmail.com
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;