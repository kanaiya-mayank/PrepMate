package Entities.Exam;

import Entities.User.Student;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "EXAM_TABLE")
public class Exam {
    @Id
    @Column(name = "NAME_PK")
    private String examName;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL,  fetch = FetchType.EAGER)
    private Set<Student> students;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL,  fetch = FetchType.EAGER)
    private Set<Stream> streams;


    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public Set<Student> getStudents() {
        return students;
    }

    public void setStudents(Set<Student> students) {
        this.students = students;
    }

    public Set<Stream> getStreams() {
        return streams;
    }

    public void setStreams(Set<Stream> streams) {
        this.streams = streams;
    }
}
