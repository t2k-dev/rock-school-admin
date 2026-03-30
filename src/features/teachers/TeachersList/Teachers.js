import React from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { NoRecords } from "../../../components/NoRecords";
import { Button, Container, Input } from "../../../components/ui";
import { SectionTitle, SectionWrapper } from "../../../layout";
import { getTeachers } from "../../../services/apiTeacherService";
import TeacherCard from "./TeacherCard";

class Teachers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchText: "",
      teachers: [],
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };
  
  async onFormLoad() {
    this.setState({ isLoading: true });
    const returnedTeachers = await getTeachers();
    this.setState({ teachers: returnedTeachers, isLoading: false });
  }

  renderTeachers(teachers) {
    const { searchText } = this.state;
    
    const activeTeachers = teachers?.
      filter((s) => s.firstName.includes(searchText)).
      sort((a, b) => {
        if (a.firstName < b.firstName) return -1;
        if (a.firstName > b.firstName) return 1;
        
        return 0;
      });

    if (!activeTeachers || activeTeachers.length === 0) {
      return <NoRecords />;
    } 

    return(
      <>
      {activeTeachers.map((item, index) => <TeacherCard key={index} item={item} />)}
      </>
    );
  }

  render() {
    const { searchText, teachers, isLoading } = this.state;

    if (isLoading) {
      return <Loading />;
    }
    
    const activeTeachers = teachers?.filter((t) => t.isActive);

    const inactiveTeachers = teachers?.filter((t) => !t.isActive);

    return (
      <SectionWrapper>
        <div className="mx-auto max-w-5xl">

          <SectionTitle>Преподаватели</SectionTitle>

          <Container className="flex flex-col gap-8">

              {/* Search*/}
              <label className="flex flex-col gap-3 mb-6">
                <Input
                  placeholder="Поиск..."
                  value={searchText}
                  onChange={this.handleSearchChange}
                />
              </label>

              {/* Add button */}
              <div className="text-center">
                <Button
                  as={Link}
                  to="/admin/registerTeacher"
                  variant="primary"
                >
                  + Новый преподаватель
                </Button>
              </div>

              {/* Teachers lists */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="m-0 text-[18px] font-semibold text-text-main">Активные</h3>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[12px] uppercase tracking-[0.16em] text-text-muted">
                    {activeTeachers?.length || 0}
                  </span>
                </div>
                <div className="space-y-5">{this.renderTeachers(activeTeachers)}</div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="m-0 text-[18px] font-semibold text-text-main">Неактивные</h3>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[12px] uppercase tracking-[0.16em] text-text-muted">
                    {inactiveTeachers?.length || 0}
                  </span>
                </div>
                <div className="space-y-5">{this.renderTeachers(inactiveTeachers)}</div>
              </div>
          </Container>
        </div>
      </SectionWrapper>
    );
  }
}

export default Teachers;
