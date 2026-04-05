import React from "react";

import { Loading } from "../../../components/Loading";
import { FormLabel } from "../../../components/ui";
import SubscriptionType from "../../../constants/SubscriptionType";
import { SectionTitle, SectionWrapper } from "../../../layout";
import { getActiveBands } from "../../../services/apiBranchService";
import { getStudent } from "../../../services/apiStudentService";
import { addRehearsalSubscription } from "../../../services/apiSubscriptionService";
import { getTariffByType } from "../../../services/apiTariffService";
import TariffCard from "../../tariffs/TariffCard";
import { SubscriptionStudents } from "../SubscriptionStudents";

export class RehearsalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student: null,
      bands: [],
      selectedBandId: null,
      tariff: null,
      rehearsalTariffAmount: 0,
      isLoading: false,
      isSaving: false,
      error: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.loadStudent();
    this.loadBands();
    this.loadRehearsalTariff();
  }

  loadStudent = async () => {
    try {
      const studentId = this.props.match?.params?.id;
      if (studentId) {
        const student = await getStudent(studentId);
        this.setState({ student: student });
      }
    } catch (error) {
      console.error("Error loading student:", error);
      this.setState({ error: "Не удалось загрузить информацию ученика" });
    }
  };

  loadBands = async () => {
    try {
      this.setState({ isLoading: true });
      const bands = await getActiveBands(1); //DEV
      this.setState({
        bands: bands || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading bands:", error);
      this.setState({
        error: "Не удалось загрузить список групп",
        isLoading: false,
      });
    }
  };

  loadRehearsalTariff = async () => {
    try {
      const tariff = await getTariffByType(SubscriptionType.REHEARSAL, null);
      this.setState({
        tariff: tariff,
        rehearsalTariffAmount: tariff?.amount || 0,
      });
    } catch (error) {
      console.error("Error loading rehearsal tariff:", error);
    }
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const { selectedBandId, student } = this.state;

    if (!selectedBandId || !student) {
      this.setState({ error: "Пожалуйста, выберите группу" });
      return;
    }

    try {
      this.setState({ isSaving: true });
      const requestData = {
        studentId: student.studentId,
        bandId: selectedBandId,
        tariffId: this.state.tariff?.tariffId,
      };

      await addRehearsalSubscription(requestData);

      this.props.history.push(`/student/${student.studentId}`);
    } catch (error) {
      console.error("Error saving rehearsal:", error);
      this.setState({
        error: "Не удалось сохранить",
        isSaving: false,
      });
    }
  };

  render() {
    const {
      student,
      bands,
      selectedBandId,
      tariff,
      rehearsalTariffAmount,
      isLoading,
      isSaving,
      error,
    } = this.state;

    if (isLoading) {
      return <Loading message="Загрузка данных..." />;
    }

    const students = student ? [student] : [];

    let bandsList;
    if (bands && bands.length > 0) {
      bandsList = bands.map((item, index) => (
        <option key={index} value={item.bandId}>
          {item.name}
        </option>
      ));
    }

    return (
            <SectionWrapper>
              <SectionTitle className="text-center">
                Репетиции
              </SectionTitle>
      
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
            <div className="hidden md:block md:w-1/4"></div>

            <div className="w-full md:w-1/2 bg-card-bg p-6 rounded-2xl shadow-xl border border-secondary/20">

              <form onSubmit={(e) => e.preventDefault()}>
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-danger/20 border border-danger text-danger text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <SubscriptionStudents
                    students={students}
                    allowRemove={false}
                    allowAdd={false}
                  />
                </div>

                <div className="mb-6">
                  <FormLabel
                    as ="div"
                    htmlFor="BandSelect"
                  >
                    <strong>Группа</strong>
                  </FormLabel>
                  <div className="relative">
                    <select
                      id="selectedBandId"
                      className="w-full bg-input-bg border border-secondary/20 rounded-xl px-4 py-3 text-text-main outline-none focus:border-accent transition-all appearance-none disabled:opacity-40"
                      value={selectedBandId || ""}
                      onChange={(e) =>
                        this.setState({ selectedBandId: e.target.value })
                      }
                      disabled={bands.length === 0}
                    >
                      <option value="">Выберите группу...</option>
                      {bandsList}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <hr className="border-secondary/10 my-6" />

                <div className="text-center">
                  <button
                    type="button"
                    className={`
                px-12 py-3 rounded-full font-bold text-white transition-all shadow-lg active:scale-95
                ${
                  isSaving || !selectedBandId
                    ? "bg-secondary/40 cursor-not-allowed opacity-50"
                    : "bg-success hover:bg-success/80"
                }
              `}
                    onClick={this.handleSave}
                    disabled={isSaving || !selectedBandId}
                  >
                    {isSaving ? "Сохранение..." : "Добавить"}
                  </button>
                </div>
              </form>
            </div>

            <div className="w-full md:w-1/4">
              {tariff && (
                <div className="">
                  <TariffCard
                    title="Тариф"
                    description="4 Репетиции"
                    amount={rehearsalTariffAmount}
                    style={{ marginTop: "0px" }}
                    showIcon={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }
}

export default RehearsalForm;
