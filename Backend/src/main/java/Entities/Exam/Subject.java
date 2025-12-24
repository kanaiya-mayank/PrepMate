package Entities.Exam;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "SUBJECT_TABLE")
public class Subject {
    @Id
    private String id;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "JOIN_STREAM_SUBJECT",
            joinColumns = { @JoinColumn(name = "SUBJECT_FK")},
            inverseJoinColumns = { @JoinColumn(name = "STREAM_FK")}
    )
    private Set<Stream> streams;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Chapter> chapters;

    public Set<Chapter> getChapters() {
        return chapters;
    }

    public void setChapters(Set<Chapter> chapters) {
        this.chapters = chapters;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Set<Stream> getStreams() {
        return streams;
    }

    public void setStreams(Set<Stream> streams) {
        this.streams = streams;
    }

}
