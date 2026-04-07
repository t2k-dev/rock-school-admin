import { getHomeScreenDetails } from "../../../services/apiHomeService";
import { markComplete } from "../../../services/apiNoteService";

export class useHomeScreen {
  private component: any;

  constructor(component: any) {
    this.component = component;
  }

  async loadData() {
    try {
      this.component.setState({ isLoading: true, error: null });
      const details = await getHomeScreenDetails(1);
      this.component.setState({
        rooms: details.rooms,
        notes: details.notes,
        attendances: details.attendances,
        isLoading: false,
      });
    } catch (error: any) {
      this.component.setState({ error: error.message, isLoading: false });
    }
  }

  async changeNoteStatus(noteId: number, status: number) {
    await markComplete(noteId);
    const currentNotes = this.component.state.notes;
    if (currentNotes) {
      this.component.setState({
        notes: currentNotes.map((n: any) =>
          n.noteId === noteId ? { ...n, status } : n,
        ),
      });
    }
  }
}
