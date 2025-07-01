namespace ConstructionCompany.Infrastructure.Enumerations
{
    public enum ApplicationStatus
    {
        Created = 0,              // Initial draft by agent
        Submitted = 1,            // Sent to supervisor
        ReturnedBySupervisor = 2, // Supervisor returned with feedback
        Approved = 3,             // Approved by supervisor
        Finished = 4              // Finalized/completed project
    }
}
